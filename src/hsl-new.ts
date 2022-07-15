import { HslColor } from './interfaces.js';
import {
  sanitize,
  keepInAlphaRange,
  keepPercentInRange,
  keepHueInRange,
  getColorSpace,
} from './utils.js';

const mapInputValues = (values: any[]) => {
  return values.map((value: string | number, i: number) => {
    const isAlpha = i === 3;
    const isHue = i === 0;
    const isPercent = typeof value === 'string' && value.endsWith('%');
    const isFloat = (value) =>
      typeof value === 'string' && /^\d*\.\d+$/.test(value);
    const isProbablyPercentage =
      isFloat(value) && parseFloat(value as string) < 1;
    const willConvertToPercentage = !isAlpha && !isHue && isProbablyPercentage;

    if (isHue) {
      return keepHueInRange(parseFloat(value as string));
    }
    else if (isAlpha && !isPercent) {
      return keepInAlphaRange(value as number);
    }
    else if (isAlpha && isPercent) {
      return keepInAlphaRange(parseInt(value) / 100);
    }
    else if (willConvertToPercentage) {
      const percent = (value as number) * 100;
      return keepPercentInRange(percent);
    }
    else {
      return keepPercentInRange(parseFloat(value as string));
    }
  });
};

const parseInputString = (input: string) => {
  const s = sanitize(input);
  const arr = s.split(/,|\(|\)|\s/g).filter((v: string | any[]) => v.length);
  const colorSpace = getColorSpace(input);
  const values = mapInputValues(arr.slice(1));
  return { colorSpace, values };
};

const toObjectFromString = (s: string) => {
  const { colorSpace, values } = parseInputString(s);
  return values.reduce<HslColor>((acc, value, i) => {
    const key = i === 3 ? 'a' : colorSpace[i];
    acc[key] = value;
    return acc;
  }, {} as HslColor);
};

const toArrayFromString = (s: string) => {
  return parseInputString(s).values;
};

const toStringFromString = (s: string) => {
  const { colorSpace, values } = parseInputString(s);
  const valueString = values
    .map((value: any, i: number) => {
      return i === 0 ? `${value}deg` : i < 3 ? `${value}%` : value;
    })
    .join(', ');
  return `${colorSpace}(${valueString})`;
};

const toArrayFromObject = (
  o: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  return mapInputValues(Object.values(o)).filter((v) => {
    return typeof v !== 'undefined' && v !== null && !isNaN(v);
  });
};

const toObjectFromObject = (o: {}) => {
  const keys = Object.keys(o);
  const arr = toArrayFromObject(o);
  return arr.reduce((acc: { [x: string]: any }, value: any, i: number) => {
    const key = i === 3 ? 'a' : keys[i];
    acc[key] = value;
    return acc;
  }, {});
};

const toStringFromObject = (o: {}) => {
  const values = toArrayFromObject(o)
    .map((value: any, i: number) => {
      return i === 0 ? `${value}deg` : i < 3 ? `${value}%` : value;
    })
    .join(', ');

  return `hsl(${values})`;
};

export const isHsl = (input: string | {}) => {
  const colorSpace =
    typeof input === 'string'
      ? parseInputString(input).colorSpace
      : Object.keys(input).join('');

  return colorSpace === 'hsl' || colorSpace === 'hsla';
};

export const parseHsl = (input: string | {}) => {
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
    /**
     * @returns an array of 3 or 4 numbers representing a color's hue, saturation, and lightness properites. If 4 numbers are present, the 4th represents the color's alpha transparency value
     */
    array: (): number[] => array,
    /**
     * @returns -- An object representation of an HSL color.
     * Example: { h: 240, s: 100, l: 50, a: 0.2 }
     * Represents a hue of 240deg, with 100% saturation, 50% lightness and 20% opacity
     */
    object: (): { [x: string]: any } => object,

    /**
     * @returns a fully formed hsl css color string
     */
    css: (): string => css,
  };
};
