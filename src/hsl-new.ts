import { HslColor } from './interfaces';

const sanitize = (s: string) => s.replace(/\s/g, '').toLowerCase();
const makeRangeKeeper = (min: number, max: number) => (n: number) =>
  Math.max(min, Math.min(n, max));
const keepInAlphaRange = makeRangeKeeper(0, 1);
const keepPercentInRange = makeRangeKeeper(0, 100);
const keepHueInRange = (n: number) => {
  while (n < 0 || n >= 360) {
    n = n < 0 ? n + 360 : n >= 360 ? n - 360 : n;
  }
  return n;
};

const mapInputValues = (values: any[]) => {
  return values.map((value: string | number, i: number) => {
    const isAlpha = i === 3;
    const isHue = i === 0;
    const isPercent = typeof value === 'string' && value.endsWith('%');

    if (isHue) {
      return keepHueInRange(parseFloat(value as string));
    }
    else if (isAlpha && !isPercent) {
      return keepInAlphaRange(value as number);
    }
    else if (isAlpha && isPercent) {
      return keepInAlphaRange(parseInt(value) / 100);
    }
    else {
      return keepPercentInRange(parseFloat(value as string));
    }
  });
};

const parseInputString = (input: string) => {
  const s = sanitize(input);
  const arr = s.split(/,|\(|\)/g).filter((v: string | any[]) => v.length);
  const colorSpace = arr[0];
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
  return mapInputValues(Object.values(o)).filter((v) => v);
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

  console.log({ colorSpace });

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
    array: () => array,
    object: () => object,
    css: () => css,
  };
};
