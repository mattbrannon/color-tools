import {
  sanitize,
  getColorSpaceFromString,
  stripPercent,
  convertAlpha,
  toFloat,
} from '../utils/index.js';

const keepRgbInRange = (num) => {
  return num < 0 ? 0 : num > 255 ? 255 : num;
};

const convertPercentToRgb = (num) => {
  const n = stripPercent(num);
  const converted = Math.min(Math.round(toFloat((n * 255) / 100)), 255);
  return converted > 0 ? converted : 0;
};

const getValuesFromString = (str) => {
  return str
    .split(/\s+|,|\(|\)/g)
    .filter((val) => /\d+/g.test(val))
    .map((value, i) => {
      return i < 3
        ? value.includes('%')
          ? convertPercentToRgb(value)
          : keepRgbInRange(value)
        : convertAlpha(value);
    })
    .map(Number);
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

const parseString = (str) => {
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

export { keepRgbInRange, toString, parseRGB };
