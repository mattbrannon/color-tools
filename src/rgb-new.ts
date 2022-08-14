import { RgbColor } from './interfaces';
import {
  getColorSpace,
  keepAlphaInRange,
  keepInRgbRange,
  parseString,
} from './utils';

const convertPercentToRgbValue = (n: string) => {
  return keepInRgbRange(Math.round((parseInt(n) * 255) / 100));
};

const mapInputRgbValues = (values: any[]) => {
  return values.map((value, i) => {
    const isAlpha = i === 3;
    const isPercent = typeof value === 'string' && value.endsWith('%');
    const isGreaterThanOne = parseFloat(value) > 1;

    if (!isAlpha) {
      if (isPercent) {
        return convertPercentToRgbValue(value as string);
      }
      else {
        return keepInRgbRange(Math.round(value as number));
      }
    }
    else {
      if (isPercent || isGreaterThanOne) {
        return keepAlphaInRange(parseFloat(value) / 100);
      }
      else {
        return keepAlphaInRange(parseFloat(value as string));
      }
    }
  });
};

const parseInputRgbString = (input: any) => {
  const arr = parseString(input);
  const colorSpace = getColorSpace(input);
  const values = mapInputRgbValues(arr.slice(1));

  return { colorSpace, values };
};

const toObjectFromRgbString = (s: any) => {
  const { colorSpace, values } = parseInputRgbString(s);
  return values.reduce((acc, value, i) => {
    const key = i === 3 ? 'a' : colorSpace[i];
    acc[key as keyof RgbColor] = Number(value);
    return acc;
  }, {} as RgbColor);
};

const toArrayFromRgbString = (s: any) => {
  return parseInputRgbString(s).values;
};

const toStringFromRgbString = (s: any) => {
  const { colorSpace, values } = parseInputRgbString(s);
  return `${colorSpace}(${values.join(', ')})`;
};

const toArrayFromRgbObject = (
  o: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  return mapInputRgbValues(Object.values(o));
};

export const toObjectFromRgbArray = (arr: any[]) => {
  return mapInputRgbValues(arr).reduce((acc, value, i) => {
    const key = i === 0 ? 'r' : i === 1 ? 'g' : i === 2 ? 'b' : 'a';
    acc[key as keyof RgbColor] = Number(value);
    return acc;
  }, {} as RgbColor);
};

export const toStringFromRgbArray = (arr: any[]) => {
  const values = mapInputRgbValues(arr);
  return `rgb(${values.join(', ')})`;
};

const toObjectFromRgbObject = (o: {}) => {
  const keys = Object.keys(o);
  const arr = toArrayFromRgbObject(o);
  return arr.reduce((acc: { [x: string]: any }, value: any, i: number) => {
    const key = i === 3 ? 'a' : keys[i];
    acc[key] = value;
    return acc;
  }, {});
};

const toStringFromRgbObject = (o: {}) => {
  const colorSpace = getColorSpace(o);
  const values = toArrayFromRgbObject(o).join(', ');
  return `${colorSpace}(${values})`;
};

export const parseRgb = (input: string | {} | any[]) => {
  const array = Array.isArray(input)
    ? mapInputRgbValues(input)
    : typeof input === 'string'
    ? toArrayFromRgbString(input)
    : toArrayFromRgbObject(input);
  const object = Array.isArray(input)
    ? toObjectFromRgbArray(input)
    : typeof input === 'string'
    ? toObjectFromRgbString(input)
    : toObjectFromRgbObject(input);
  const css = Array.isArray(input)
    ? toStringFromRgbArray(input)
    : typeof input === 'string'
    ? toStringFromRgbString(input)
    : toStringFromRgbObject(input);

  return {
    array: () => array,
    object: () => object,
    css: () => css,
  };
};
