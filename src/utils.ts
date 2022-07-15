import { COLOR_NAMES } from './color-names.js';

export const sanitize = (s: string) => s.replace(/\s/g, '').toLowerCase();

export const toFloat = (n: number) => Math.round(n * 100) / 100;

export function makeRangeKeeper(min: number, max: number) {
  return function (n: number) {
    return Math.max(min, Math.min(n, max));
  };
}

export const keepInRgbRange = makeRangeKeeper(0, 255);
export const keepInAlphaRange = makeRangeKeeper(0, 1);
export const keepPercentInRange = makeRangeKeeper(0, 100);
export const keepHueInRange = (n: number) => {
  while (n < 0 || n >= 360) {
    n = n < 0 ? n + 360 : n >= 360 ? n - 360 : n;
  }
  return n;
};

export const isHex = (s: any) => {
  const re = /^#?([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/gi;
  return typeof s === 'string' && re.test(s);
};

export const getColorSpace = (input: any) => {
  if (typeof input === 'string') {
    return isHex(input) || isNamedColor(input)
      ? 'hex'
      : sanitize(input).slice(0, 3);
  }
  else if (typeof input === 'object') {
    return Object.keys(input).join('').slice(0, 3);
  }
  else {
    throw new Error('Color must be a string or an object');
  }
};

export const isRgb = (input: string | {}) => {
  return getColorSpace(input) === 'rgb';
};

export const isHsl = (input: string | {}) => {
  return getColorSpace(input) === 'hsl';
};

export const isNamedColor = (s: string) => {
  return !!COLOR_NAMES[s];
};

export const removePrefix = (prefix: string) => (s: string) => {
  return s.charAt(0) === prefix ? s.slice(1) : s;
};

export const addPrefix = (prefix: string) => (s: string) => {
  return s.charAt(0) !== prefix ? prefix + s : s;
};

export const removeHash = removePrefix('#');
export const addHash = addPrefix('#');

export const utils = {
  sanitize,
  toFloat,
  makeRangeKeeper,
  keepInRgbRange,
  keepInAlphaRange,
  keepPercentInRange,
  keepHueInRange,
  isHex,
  getColorSpace,
  isRgb,
  isHsl,
  isNamedColor,
  removePrefix,
  addPrefix,
  removeHash,
  addHash,
};
