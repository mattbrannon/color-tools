import { parseHSL } from '../lib/hsl.js';
import { keepRgbInRange, parseRGB } from '../lib/rgb.js';
import { COLORS } from '../constants/colors.js';

const getDataType = (value) => {
  return Object.prototype.toString
    .call(value)
    .slice(8, -1)
    .toLowerCase();
};

const isString = (value) => getDataType(value) === 'string';
const isObject = (value) => getDataType(value) === 'object';
const isPercent = (value) => isString(value) && value.endsWith('%');

const isValidHex = (s) => {
  if (isString(s)) {
    const re = /^#?([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
    return re.test(sanitize(s));
  }
  return false;
};

const isShortHex = (s) => isValidHex(s) && (s.length === 3 || s.length === 4);

const isNamedColor = (str) => {
  if (isString(str)) {
    const name = str.match(/^\b[a-zA-Z]+\b$/g);
    if (name) {
      return name[0].toLowerCase() in COLORS ? COLORS[name] : null;
    }
  }
};

const getColorSpaceFromString = (str) =>
  isString(str) && str.slice(0, str.indexOf('('));

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

const parseString = (str) => {
  let colorSpace = getColorSpaceFromString(str);
  const rgb = [ 'rgb', 'rgba' ];
  const hsl = [ 'hsl', 'hsla' ];

  const color = rgb.includes(colorSpace)
    ? parseRGB(str)
    : hsl.includes(colorSpace)
    ? parseHSL(str)
    : null;

  colorSpace = getColorSpaceFromString(color.css());
  const values = color.array();

  return { colorSpace, values };
};

const toObject = (str) => {
  const { values, colorSpace } = parseString(str);
  return values.reduce((acc, val, i) => {
    const key = colorSpace[i];
    acc[key] = val;
    return acc;
  }, {});
};

const toString = (object) => {
  const rgb = [ 'rgb', 'rgba' ];
  const hsl = [ 'hsl', 'hsla' ];
  const colorSpace = Object.keys(object).join('');

  const setHslString = (num, i) =>
    i === 0 ? `${num}deg` : i < 3 ? `${num}%` : num;

  const setRgbString = (num, i) => (i < 3 ? keepRgbInRange(num) : num);

  const setter = rgb.includes(colorSpace)
    ? setRgbString
    : hsl.includes(colorSpace)
    ? setHslString
    : null;
  const values = Object.values(object).map(setter);
  return `${colorSpace}(${values.join(', ')})`;
};

export {
  convertAlpha,
  sanitize,
  stripPercent,
  getColorSpaceFromString,
  toFloat,
  toObject,
  isObject,
  toString,
  isValidHex,
  isShortHex,
  isNamedColor,
};
