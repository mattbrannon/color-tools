import { parseHSL } from '../lib/hsl.js';
import { keepRgbInRange, parseRGB } from '../lib/rgb.js';
import { COLORS } from '../constants/colors.js';

const echo = (...args) => console.log(...args);

const getDataType = (value) => {
  return Object.prototype.toString
    .call(value)
    .slice(8, -1)
    .toLowerCase();
};

let isString = (value) => getDataType(value) === 'string';
let isObject = (value) => getDataType(value) === 'object';
let isPercent = (value) => isString(value) && value.endsWith('%');

let isValidHex = (s) => {
  if (isString(s)) {
    const re = /^#?([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
    return re.test(sanitize(s));
  }
  return false;
};

let isShortHex = (s) => isValidHex(s) && (s.length === 3 || s.length === 4);

const isNamedColor = (str) => {
  if (isString(str)) {
    const name = str.match(/^\b[a-zA-Z]+\b$/g);
    if (name) {
      return name[0].toLowerCase() in COLORS ? COLORS[name] : null;
    }
  }
};

let percentToFloat = (num) => (isPercent(num) ? num.slice(0, -1) / 100 : undefined);

let getColorSpaceFromString = (str) => isString(str) && str.slice(0, str.indexOf('('));

const sanitize = (str) => {
  return str
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();
};

const stripPercent = (str) => {
  if (isString(str)) {
    const i = str.indexOf('%');
    return i > -1 ? str.slice(0, i) : str;
  }
  return str;
};

const toFloat = (n) => Math.round(n * 100) / 100;

const convertAlpha = (alpha) => {
  let result;
  if (isPercent(alpha)) {
    const isNegative = Math.sign(stripPercent(alpha)) <= 0;
    const n = [ stripPercent(alpha) ].map(Number).map((val) => val / 100)[0];
    result = isNegative ? 0 : n;
  }
  else if (Math.sign(alpha) > -1) {
    result = toFloat(alpha);
  }
  else {
    return 0;
  }
  return result > 1 ? 1 : result < 0 ? 0 : result;
};

const getColorType = (color) => {
  const dataType = getDataType(color);
  if (dataType === 'string') {
    if (!isValidHex(color)) {
      return getColorSpaceFromString(color);
    }
    return 'hex';
  }
  else if (dataType === 'object') {
    return Object.keys(color).join('');
  }
};

const parseString = (str) => {
  let format = getColorSpaceFromString(str);
  const rgb = [ 'rgb', 'rgba' ];
  const hsl = [ 'hsl', 'hsla' ];

  const color = rgb.includes(format) ? parseRGB(str) : hsl.includes(format) ? parseHSL(str) : null;

  format = getColorSpaceFromString(color.css());
  const values = color.array();

  return { format, values };
};

const toObject = (str) => {
  const { values, format } = parseString(str);
  return values.reduce((acc, val, i) => {
    const key = format[i];
    acc[key] = val;
    return acc;
  }, {});
};

const toString = (object) => {
  const rgb = [ 'rgb', 'rgba' ];
  const hsl = [ 'hsl', 'hsla' ];
  const format = Object.keys(object).join('');

  const setHslString = (num, i) => (i === 0 ? `${num}deg` : i < 3 ? `${num}%` : num);

  const setRgbString = (num, i) => (i < 3 ? keepRgbInRange(num) : num);

  const setter = rgb.includes(format) ? setRgbString : hsl.includes(format) ? setHslString : null;
  const values = Object.values(object).map(setter);
  return `${format}(${values.join(', ')})`;
};

export {
  echo,
  convertAlpha,
  getDataType,
  sanitize,
  isPercent,
  stripPercent,
  percentToFloat,
  getColorSpaceFromString,
  getColorType,
  toFloat,
  toObject,
  isObject,
  toString,
  isValidHex,
  isShortHex,
  parseRGB,
  isNamedColor,
};
