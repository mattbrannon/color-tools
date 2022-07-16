import { RgbColor } from './interfaces';
import {
  getColorSpace,
  keepInAlphaRange,
  keepInRgbRange,
  sanitize,
} from './utils';

const mapInputValues = (values: any[]) => {
  return values.map((value: string | number, i: number) => {
    const isPercent = typeof value === 'string' && value.endsWith('%');
    const isAlpha = i === 3;
    const isFloat = (value) =>
      typeof value === 'string' && /^\d*\.\d+$/.test(value);
    const isProbablyPercentage =
      isFloat(value) && !isAlpha && parseFloat(value as string) < 1;

    if (isPercent && !isAlpha) {
      return keepInRgbRange(Math.round((parseInt(value) * 255) / 100));
    }
    else if (isProbablyPercentage) {
      const percent = parseFloat(value as string) * 100;
      const hexValue = (percent * 255) / 100;
      return keepInRgbRange(Math.round(hexValue));
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

export const parseInputString = (input: any) => {
  const s = sanitize(input);
  const arr = s.split(/,|\(|\)/g).filter((v: string | any[]) => v.length);

  const colorSpace = getColorSpace(input);
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
  const colorSpace = getColorSpace(o);
  const values = toArrayFromObject(o).join(', ');
  return `${colorSpace}(${values})`;
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

// const makeColor = (input) => {
//   const color = parseRgb(input);
//   return {
//     set(n: number) {
//       const { g, b } = color.object();
//       const r = n;
//       return makeColor({ r, g, b });
//     },
//     adjust(n: number) {
//       let { r, g, b } = color.object();
//       r += n;
//       return makeColor({ r, g, b });
//     },
//   };
// };

export class RGB {
  private r: number;
  private g: number;
  private b: number;
  constructor(input) {
    const { r, g, b } = parseRgb(input).object();
    this.r = r;
    this.g = g;
    this.b = b;
  }

  red(R: number) {
    const { g, b, r } = this;
    return new RGB({ r: r + R, g, b });
  }

  green(G: number) {
    const { r, g, b } = this;
    return new RGB({ r, g: g + G, b });
  }

  blue(B: number) {
    const { r, g, b } = this;
    return new RGB({ r, g, b: b + B });
  }
}
