import { COLOR_NAMES } from './color-names';
import { PreferedColorSpace } from './interfaces';

export const sanitize = (s: string) => s.replace(/\s/g, '').toLowerCase();

export const toFloat = (n: number) => Math.round(n * 100) / 100;

export const isFloat = (value: any) => {
  return typeof value === 'string' && /^\d*\.\d+$/.test(value);
};

export function makeRangeKeeper(min: number, max: number) {
  return function (n: number): number {
    return Math.max(min, Math.min(n, max));
  };
}

export const keepRgbInRange = makeRangeKeeper(0, 255);
export const keepAlphaInRange = makeRangeKeeper(0, 1);
export const keepPercentInRange = makeRangeKeeper(0, 100);
export const keepHueInRange = (n: number) => {
  while (n < 0 || n >= 360) {
    n = n < 0 ? n + 360 : n >= 360 ? n - 360 : n;
  }
  return n;
};

export const getDirection = (start: number, end: number) => {
  const normalWay = Math.max(start, end) - Math.min(start, end);
  const loopAround = 360 - Math.max(start, end) + Math.min(start, end);
  const distance = Math.min(normalWay, loopAround);
  const longest = Math.max(normalWay, loopAround);

  const forward =
    (start < end && normalWay < loopAround) ||
    (start > end && normalWay > loopAround);

  const direction = forward ? 1 : !forward ? -1 : 0;

  return { distance, direction, longest, start, end };
};

export const makeRangeOfSteps = (steps: number) => {
  return function (isHue = false) {
    return function (start: number, end: number) {
      const { direction, distance } = getDirection(start, end);
      const adjustBy = (distance / (steps - 1)) * direction;

      const values = [];
      for (let i = 0; i < steps; i++) {
        const value = isHue ? toFloat(keepHueInRange(start)) : toFloat(start);
        values.push(value);
        start += adjustBy;
      }
      return values;
    };
  };
};

export const isHex = (s: any) => {
  try {
    const re = /^#?([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/gi;
    return typeof s === 'string' && re.test(s);
  }
  catch {
    return false;
  }
};

export const parseString = (s: string) => {
  return s.split(/\(|\)|\s|,|\//g).filter((v) => v.length);
};

export const getColorSpace = (input: any) => {
  if (typeof input === 'string') {
    const colorSpace =
      isHex(input) || isNamedColor(input) ? 'hex' : sanitize(input).slice(0, 3);

    return colorSpace as PreferedColorSpace;
  }
  else if (typeof input === 'object') {
    return Object.keys(input).join('').slice(0, 3);
  }
  else if (typeof input === 'number') {
    /// handle hex numbers like 0x09f
    throw new Error('not implemented yet');
  }
  else {
    throw new Error('Color must be a string or an object');
  }
};

interface RgbObject {
  [key: string]: string | number;
}

type RgbArray = (string | number)[];

type RgbInput = string | RgbObject | RgbArray;

export const isRgb = (input: RgbInput) => {
  try {
    return getColorSpace(input) === 'rgb';
  }
  catch {
    return false;
  }
};

export const isHsl = (input: string | object) => {
  try {
    return getColorSpace(input) === 'hsl';
  }
  catch {
    return false;
  }
};

export const isNamedColor = (s: string) => {
  try {
    return s in COLOR_NAMES;
  }
  catch {
    return false;
  }
};

export const removePrefix = (prefix: string) => (s: string) => {
  return s.charAt(0) === prefix ? s.slice(1) : s;
};

export const addPrefix = (prefix: string) => (s: string) => {
  return s.charAt(0) !== prefix ? prefix + s : s;
};

export const removeHash = removePrefix('#');
export const addHash = addPrefix('#');
