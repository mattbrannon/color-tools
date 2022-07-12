import { parseHSL } from './hsl.js';
import { parseRGB } from './rgb.js';
import { COLOR_NAMES } from './constants/colors-names.js';

interface RgbColor {
  r: number,
  g: number,
  b: number,
  a?: number
}
interface HslColor {
  h: number,
  s: number,
  l: number,
  a?: number
}


const makeRanger =
  (min: number, max: number, isLooping = false) =>
  (n:number|string) => {
    const cycle = () => {
      n = Number(n);
      while (n >= max || n < min) {
        n = n >= max ? n - max : n < min ? n + max : n;
      }
      return n;
    };

    return isLooping ? cycle() : Math.max(min, Math.min(parseFloat(String(n)), max));
  };

export const keepHueInRange = makeRanger(0, 360, true);
export const keepPercentInRange = makeRanger(0, 100);
export const keepRgbInRange = makeRanger(0, 255);
export const keepAlphaInRange = makeRanger(0, 1);

const getDataType = (value:any) => {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};

const isString = (value: any) => getDataType(value) === 'string';
const isObject = (value: any) => getDataType(value) === 'object';
const isPercent = (value: any) => isString(value) && value.endsWith('%');

const isValidHex = (s: string) => {
  if (isString(s)) {
    const re = /^#?([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
    return re.test(sanitize(s));
  }
  return false;
};

const isShortHex = (s:string) => isValidHex(s) && (s.length === 3 || s.length === 4);

const isNamedColor = (str:string) => {
  try {
    const name = sanitize(str) as keyof typeof COLOR_NAMES
    const found: boolean = !!COLOR_NAMES[name];
    return found
    // const found: boolean = !!COLOR_NAMES[name] as keyof typeof COLOR_NAMES
  } catch {
    return false;
  }
};

const getNamedColor = (str:string) => {
  if (isString(str) && isNamedColor(str)) {
    const name = sanitize(str) as keyof typeof COLOR_NAMES
    const hex: string = COLOR_NAMES[name];
    return hex
  }
};

const getColorSpaceFromString = (str:string) => {
  const stopIndex = str.indexOf('(');
  return str.slice(0, stopIndex).replace(/\s+/g, '').toLowerCase();
};

const getColorSpaceFromObject = (obj:object) => {
  return Object.keys(obj).join('');
};

const getColorSpace = (input: string|object) => {
  const colorSpace = isString(input)
    ? getColorSpaceFromString(input as string)
    : isObject(input)
    ? getColorSpaceFromObject(input as object)
    : null;

  if (!colorSpace) throw Error(`Unrecognized color space for ${input}`);

  return colorSpace;
};

const sanitize = (str:string) => {
  return str.replace(/\s+/g, '').trim().toLowerCase();
};

const stripPercent = (str:string) => {
  if (isString(str)) {
    const i = str.indexOf('%');
    return i > -1 ? Number(str.slice(0, i)) : Number(str);
  }
  return Number(str);
};

const toFloat = (n:number) => Math.round(n * 100) / 100;

const convertAlpha = (alpha: any) => {
  let result;
  if (isPercent(alpha)) {
    const isNegative = Math.sign(stripPercent(alpha)) <= 0;
    const n = [stripPercent(alpha)].map(Number).map((val) => val / 100)[0];
    result = isNegative ? 0 : n;
  } else if (Math.sign(alpha) > -1) {
    result = toFloat(alpha);
  } else {
    return 0;
  }
  return result > 1 ? 1 : result < 0 ? 0 : result;
};

const stringToObject = (str:string) => {
  let colorSpace = getColorSpace(str);
  let color;
  if (colorSpace === 'hsl' || colorSpace === 'hsla') {
    color = parseHSL(str);
  } else if (colorSpace === 'rgb' || colorSpace === 'rgba') {
    color = parseRGB(str);
  }

  const values = color?.array() ?? []
  colorSpace =
    values.length > colorSpace.length
      ? colorSpace + 'a'
      : values.length < colorSpace.length
      ? colorSpace.slice(-1)
      : colorSpace;

  return values.reduce((acc: { [x: string]: any; }, val: any, i: number) => {
    const key = colorSpace[i];
    acc[key] = val;
    return acc;
  }, {} as HslColor|RgbColor);
};

const toString = (object:object) => {
  const rgb = ['rgb', 'rgba'];
  const hsl = ['hsl', 'hsla'];
  const colorSpace = Object.keys(object).join('');

  const setHslString = (num:string, i:number) =>
    i === 0 ? `${num}deg` : i < 3 ? `${num}%` : num;

  const setRgbString = (num:string, i:number) => (i < 3 ? keepRgbInRange(num) : num);

  const setter: any = rgb.includes(colorSpace)
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
