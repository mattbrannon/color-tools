import { RgbColor } from './interfaces';

const sanitize = (s: string) => s.replace(/\s/g, '').toLowerCase();
const makeRangeKeeper = (min: number, max: number) => (n: number) =>
  Math.max(min, Math.min(n, max));
const keepInRgbRange = makeRangeKeeper(0, 255);
const keepInAlphaRange = makeRangeKeeper(0, 1);

const mapInputValues = (values: any[]) => {
  return values.map((value: string | number, i: number) => {
    const isPercent = typeof value === 'string' && value.endsWith('%');
    const isAlpha = i === 3;
    if (isPercent && !isAlpha) {
      return keepInRgbRange(Math.round((parseInt(value) * 255) / 100));
    }
    else if (isPercent && isAlpha) {
      return keepInAlphaRange(parseFloat(value) / 100);
    }
    else if (!isPercent && !isAlpha) {
      return keepInRgbRange(Math.round(value as number));
    }
    else if (!isPercent && isAlpha) {
      return keepInAlphaRange(parseFloat(value as string));
    }
    else return value;
  });
};

export const getColorSpace = (input: any) => {
  if (typeof input === 'string') {
    const s = sanitize(input);
    return s.slice(0, s.indexOf('('));
  }
  else if (typeof input === 'object') {
    return Object.keys(input).join('');
  }
  else {
    throw new Error('Color must be a string or an object');
  }
};

export const parseInputString = (input: any) => {
  const s = sanitize(input);
  const arr = s.split(/,|\(|\)/g).filter((v: string | any[]) => v.length);
  const colorSpace = arr[0];
  const values = mapInputValues(arr.slice(1));

  return { colorSpace, values };
};

export const toObjectFromString = (s: any) => {
  const { colorSpace, values } = parseInputString(s);
  return values.reduce((acc, value, i) => {
    const key = i === 3 ? 'a' : colorSpace[i];
    acc[key] = Number(value);
    return acc;
  }, {} as RgbColor);
};

export const toArrayFromString = (s: any) => {
  return parseInputString(s).values;
};

export const toStringFromString = (s: any) => {
  const { colorSpace, values } = parseInputString(s);
  return `${colorSpace}(${values.join(', ')})`;
};

export const toArrayFromObject = (
  o: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  return mapInputValues(Object.values(o));
};

export const toObjectFromObject = (o: {}) => {
  const keys = Object.keys(o);
  const arr = toArrayFromObject(o);
  return arr.reduce((acc: { [x: string]: any }, value: any, i: number) => {
    const key = i === 3 ? 'a' : keys[i];
    acc[key] = value;
    return acc;
  }, {});
};

export const toStringFromObject = (o: {}) => {
  // const keys = Object.keys(o);
  const values = toArrayFromObject(o);
  return `rgb(${values.join(', ')})`;
};

export const isRgb = (input: string | {}) => {
  const colorSpace =
    typeof input === 'string'
      ? parseInputString(input).colorSpace
      : Object.keys(input).join('');

  return colorSpace === 'rgb' || colorSpace === 'rgba';
};

export const parseRgb = (input: string | {}) => {
  const array =
    typeof input === 'string'
      ? toArrayFromString(input)
      : toArrayFromObject(input);
  const object =
    typeof input === 'string'
      ? toObjectFromString(input)
      : toObjectFromObject(input);
  const css =
    typeof input === 'string'
      ? toStringFromString(input)
      : toStringFromObject(input);

  return {
    array: () => array,
    object: () => object,
    css: () => css,
  };
};
