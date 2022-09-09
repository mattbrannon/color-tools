import { ColorInput, ColorArray, ColorObject } from './interfaces';
import {
  getColorSpace,
  keepAlphaInRange,
  keepRgbInRange,
  parseString,
} from './utils';

const convertPercentToRgbValue = (n: string) => {
  return keepRgbInRange(Math.round((parseInt(n) * 255) / 100));
};

const mapInputRgbValues = (values: ColorArray) => {
  return values.map((value, i) => {
    const isAlpha = i === 3;
    const isPercent = typeof value === 'string' && value.endsWith('%');
    const isGreaterThanOne = parseFloat(value as string) > 1;

    if (!isAlpha) {
      if (isPercent) {
        return convertPercentToRgbValue(value as string);
      }
      else {
        return keepRgbInRange(Math.round(value as number));
      }
    }
    else {
      if (isPercent || isGreaterThanOne) {
        return keepAlphaInRange(parseFloat(value as string) / 100);
      }
      else {
        return keepAlphaInRange(parseFloat(value as string));
      }
    }
  });
};

const parseInputRgbString = (input: string) => {
  const arr = parseString(input);
  const colorSpace = getColorSpace(input);
  const values = mapInputRgbValues(arr.slice(1));

  return { colorSpace, values };
};

const toObjectFromRgbString = (s: string) => {
  const keys = [ 'r', 'g', 'b', 'a' ];
  const { values } = parseInputRgbString(s);
  return values.reduce((acc: ColorObject, value, i) => {
    // const key = i === 3 ? 'a' : colorSpace[i];
    acc[keys[i]] = Number(value);
    return acc;
  }, {});
};

const toArrayFromRgbString = (s: string) => {
  return parseInputRgbString(s).values;
};

const toStringFromRgbString = (s: string) => {
  const { colorSpace, values } = parseInputRgbString(s);
  return `${colorSpace}(${values.join(', ')})`;
};

const toArrayFromRgbObject = (o: ColorInput) => {
  return mapInputRgbValues(Object.values(o));
};

export const toObjectFromRgbArray = (arr: ColorArray) => {
  const keys = [ 'r', 'g', 'b', 'a' ];
  return mapInputRgbValues(arr).reduce((acc: ColorObject, value, i) => {
    acc[keys[i]] = value;
    return acc;
  }, {});
};

export const toStringFromRgbArray = (arr: ColorArray) => {
  const values = mapInputRgbValues(arr);
  return `rgb(${values.join(', ')})`;
};

const toObjectFromRgbObject = (o: ColorInput) => {
  const keys = [ ...Object.keys(o), 'a' ];
  const arr = toArrayFromRgbObject(o);
  return arr.reduce((acc: ColorObject, value, i: number) => {
    acc[keys[i]] = value;
    return acc;
  }, {});
};

const toStringFromRgbObject = (o: ColorInput) => {
  const colorSpace = getColorSpace(o);
  const values = toArrayFromRgbObject(o).join(', ');
  return `${colorSpace}(${values})`;
};

export const parseRgb = (input: ColorInput) => {
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
