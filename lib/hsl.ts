import {
  convertAlpha,
  getColorSpace,
  sanitize,
  stripPercent,
} from './utils.js';

import { HslColor } from './interfaces.js';

const keepHueInRange = (hue:string|number) => {
  hue = Number(hue);
  while (hue > 360 || hue < 0) {
    hue = hue > 360 ? hue - 360 : hue < 0 ? hue + 360 : hue;
  }
  return hue;
};

export const stripDegFromHue = (hue:any) => {
  if (typeof hue === 'string') {
    //@ts-ignore
    return hue.match(/-?\d+\.?\d?/g).map(Number)[0];
  }
  return hue;
};

export const keepPercentInRange = (n: number) => {
  return (n = n < 0 ? 0 : n > 100 ? 100 : n);
};

export const getHslValuesFromString = (str:string) => {
  return str
    .split(/\s+|,|\(|\)/g)
    .filter((val) => /\d+/g.test(val))
    .map((value, i) => {
      return i === 0
        ? keepHueInRange(stripDegFromHue(value))
        : i < 3
        ? keepPercentInRange(stripPercent(value))
        : i === 3
        ? convertAlpha(value)
        : value;
    });
};

export const verifyFormat = (str:string, values:number[]) => {
  str = sanitize(str);
  try {
    let format = getColorSpace(str)
    format =
      format.length === values.length
        ? format
        : format.length < values.length
        ? format + 'a'
        : format.length > values.length
        ? format.slice(0, -1)
        : ''
  
    return format;
  }
  catch (error) {
    throw error
  }
};

export const parseString = (str:string) => {
  const values: any = getHslValuesFromString(str);
  const format = verifyFormat(str, values);
  return { format, values };
};

export const toObject = (str:string) => {
  const { values, format } = parseString(str);
  return values.reduce((acc: { [x: string]: any; }, val: any, i: number) => {
    const key = format[i];
    acc[key] = val;
    return acc;
  }, {} as HslColor);
};

export const setDetails = (num:string, i:number) => {
  return i === 0 ? num + 'deg' : i < 3 ? num + '%' : num;
};

export const toString = (object:object) => {
  const format = Object.keys(object).join('');
  const values = Object.values(object).map(setDetails);

  return `${format}(${values.join(', ')})`;
};

const parseHSL = (str:string) => {
  return {
    css: () => toString(toObject(str)),
    object: () => toObject(str),
    array: () => getHslValuesFromString(str),
  };
};

export { parseHSL, keepHueInRange };
