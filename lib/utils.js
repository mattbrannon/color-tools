import { parseHSL } from './hsl.js';
import { parseRGB } from './rgb.js';
import { COLOR_NAMES } from './constants/colors-names.js';

const makeRanger =
  (min, max, isLooping = false) =>
    (n) => {
      const cycle = () => {
        while (n >= max || n < min) {
          n = n >= max ? n - max : n < min ? n + max : n;
        }
        return n;
      };

      return isLooping ? cycle() : Math.max(min, Math.min(parseFloat(n), max));
    };

export const keepHueInRange = makeRanger(0, 360, true);
export const keepPercentInRange = makeRanger(0, 100);
export const keepRgbInRange = makeRanger(0, 255);
export const keepAlphaInRange = makeRanger(0, 1);

const getDataType = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1)
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
  try {
    const name = sanitize(str);
    return !!COLOR_NAMES[name];
  }
  catch {
    return false;
  }
};

const getNamedColor = (str) => {
  if (isString(str) && isNamedColor(str)) {
    return COLOR_NAMES[sanitize(str)];
  }
};

const getColorSpaceFromString = (str) => {
  const stopIndex = str.indexOf('(');
  return str.slice(0, stopIndex).replace(/\s+/g, '')
    .toLowerCase();
};

const getColorSpaceFromObject = (obj) => {
  return Object.keys(obj).join('');
};

const getColorSpace = (input) => {
  const colorSpace = isString(input)
    ? getColorSpaceFromString(input)
    : isObject(input)
    ? getColorSpaceFromObject(input)
    : null;

  if (!colorSpace) throw Error(`Unrecognized color space for ${input}`);

  return colorSpace;
};

const sanitize = (str) => {
  return str.replace(/\s+/g, '').trim()
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
    const n = [stripPercent(alpha)].map(Number).map((val) => val / 100)[0];
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

const stringToObject = (str) => {
  let colorSpace = str.split('(')[0];
  let color;
  if (colorSpace === 'hsl' || colorSpace === 'hsla') {
    color = parseHSL(str);
  }
  else if (colorSpace === 'rgb' || colorSpace === 'rgba') {
    color = parseRGB(str);
  }

  const values = color.array();
  colorSpace =
    values.length > colorSpace.length
      ? colorSpace + 'a'
      : values.length < colorSpace.length
      ? colorSpace.slice(-1)
      : colorSpace;

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
  getColorSpace,
  toFloat,
  stringToObject,
  isObject,
  toString,
  isValidHex,
  isShortHex,
  isNamedColor,
  getNamedColor,
};
