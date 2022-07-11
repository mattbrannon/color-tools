import {
  convertAlpha,
  getColorSpaceFromString,
  sanitize,
  stripPercent,
  toFloat,
} from './utils.js';

const keepRgbInRange = (num) => {
  return num < 0 ? 0 : num > 255 ? 255 : num;
};

export const convertPercentToRgb = (num) => {
  const n = stripPercent(num);
  const converted = Math.min(Math.round(toFloat((n * 255) / 100)), 255);
  return converted > 0 ? converted : 0;
};

const toRgb = (value, i) => {
  return i < 3
    ? value.includes('%')
      ? convertPercentToRgb(value)
      : keepRgbInRange(value)
    : convertAlpha(value);
};

const splitValues = (str) => {
  const cssChars = /\s+|,|\(|\)/g;
  const isNumber = (val) => /\d+/g.test(val);

  return str.split(cssChars).filter(isNumber);
};

const getValuesFromString = (str) => {
  return splitValues(str).map(toRgb).map(Number);
};

const verifyFormat = (str, values) => {
  str = sanitize(str);
  let format = getColorSpaceFromString(str);
  format =
    format.length === values.length
      ? format
      : format.length < values.length
      ? format + 'a'
      : format.length > values.length
      ? format.slice(0, -1)
      : null;

  return format;
};

export const parseString = (str) => {
  const values = getValuesFromString(str);
  const format = verifyFormat(str, values);
  return { format, values };
};

const toObject = (str) => {
  const { format, values } = parseString(str);
  return values.reduce((acc, val, i) => {
    const key = format[i];
    acc[key] = val;
    return acc;
  }, {});
};

const setValues = (num, index) => {
  return index < 3 ? keepRgbInRange(num) : num;
};

const toString = (object) => {
  const format = Object.keys(object).join('');
  const values = Object.values(object).map(setValues);

  return `${format}(${values.join(', ')})`;
};

const parseRGB = (str) => {
  return {
    css: () => toString(toObject(str)),
    object: () => toObject(str),
    array: () => getValuesFromString(str),
  };
};

export { keepRgbInRange, parseRGB };
