import {
  convertAlpha,
  getColorSpace,
  sanitize,
  stripPercent,
  toFloat,
  keepRgbInRange,
} from './utils.js';

import { RgbColor } from './interfaces.js';

export const convertPercentToRgb = (num:string) => {
  const n = stripPercent(num);
  const converted = Math.min(Math.round(toFloat((n * 255) / 100)), 255);
  return converted > 0 ? converted : 0;
};

const toRgb = (value:string, i:number) => {
  return i < 3
    ? value.includes('%')
      ? convertPercentToRgb(value)
      : keepRgbInRange(value)
    : convertAlpha(value);
};

const splitValues = (str:string) => {
  const cssChars = /\s+|,|\(|\)/g;
  const isNumber = (val:string) => /\d+/g.test(val);

  return str.split(cssChars).filter(isNumber);
};

const getValuesFromString = (str:string) => {
  return splitValues(str).map(toRgb)
    .map(Number);
};

const verifyFormat = (str:string, values: number[]) => {
  str = sanitize(str);
  try {
    let format = getColorSpace(str);
    format =
      format.length === values.length
        ? format
        : format.length < values.length
        ? format + 'a'
        : format.length > values.length
        ? format.slice(0, -1)
        : 'null';
  
    return format;
  }
  catch (error) {
    throw error
  }
};

export const parseString = (str:string) => {
  const values = getValuesFromString(str);
  const format = verifyFormat(str, values);
  return { format, values };
};

export const toObject = (str:string) => {
  const { values, format } = parseString(str);
  return values.reduce((acc: { [x: string]: any; }, val: any, i: number) => {
    const key = format[i];
    acc[key] = val;
    return acc;
  }, {} as RgbColor);
};

const setValues = (num:string, index:number) => {
  return index < 3 ? keepRgbInRange(num) : num;
};

const toString = (object:object) => {
  const format = Object.keys(object).join('');
  const values = Object.values(object).map(setValues);

  return `${format}(${values.join(', ')})`;
};

const parseRGB = (str:string) => {
  return {
    css: () => toString(toObject(str)),
    object: () => toObject(str),
    array: () => getValuesFromString(str),
  };
};

export { keepRgbInRange, parseRGB };
