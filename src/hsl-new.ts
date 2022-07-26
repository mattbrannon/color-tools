import { HslColor } from './interfaces';
import {
  keepAlphaInRange,
  keepPercentInRange,
  keepHueInRange,
  parseString,
  isFloat,
} from './utils';

import {
  gradianToDegree,
  turnToDegree,
  radianToDegree,
  identity,
} from './angles';

const mapInputHslValues = (values: any[]) => {
  return values.map((value: string | number, i: number) => {
    const isAlpha = i === 3;
    const isHue = i === 0;
    const isPercent = typeof value === 'string' && value.endsWith('%');

    const isProbablyPercentage =
      isFloat(value) && parseFloat(value as string) < 1;

    const willConvertToPercentage = !isAlpha && !isHue && isProbablyPercentage;

    if (isHue) {
      return keepHueInRange(parseFloat(value as string));
    }
    else if (isAlpha && !isPercent) {
      return keepAlphaInRange(value as number);
    }
    else if (isAlpha && isPercent) {
      return keepAlphaInRange(parseInt(value) / 100);
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

const getAngleType = (hue: string) => hue.match(/[a-z]+/g)?.join('') ?? 'deg';

const normalize = (angleType: string) => {
  const conversionFn =
    angleType === 'turn'
      ? turnToDegree
      : angleType === 'grad'
      ? gradianToDegree
      : angleType === 'rad'
      ? radianToDegree
      : identity;

  return conversionFn;
};

const parseInputHslString = (hsl: string) => {
  const [ colorSpace, ...values ] = parseString(hsl);
  const callback = normalize(getAngleType(values[0]));

  const colorValues = values.map((s, i) => {
    const shouldConvert = (i === 3 && parseFloat(s) > 1) || s.endsWith('%');

    return i === 0
      ? keepHueInRange(callback(parseFloat(s)))
      : i !== 3
      ? keepPercentInRange(parseFloat(s))
      : shouldConvert
      ? keepAlphaInRange(parseFloat(s) / 100)
      : keepAlphaInRange(parseFloat(s));
  });
  return {
    colorSpace,
    colorValues,
  };
};

const toObjectFromHslString = (s: string) => {
  const { colorSpace, colorValues } = parseInputHslString(s);
  return colorValues.reduce((acc, value, i) => {
    const key = i === 3 ? 'a' : colorSpace[i];
    acc[key as keyof HslColor] = value;
    return acc;
  }, {} as HslColor);
};

const toArrayFromHslString = (s: string) => {
  return parseInputHslString(s).colorValues;
};

const toStringFromHslString = (s: string) => {
  const { colorSpace, colorValues } = parseInputHslString(s);
  const valueString = colorValues
    .map((value: any, i: number) => {
      return i === 0 ? `${value}deg` : i < 3 ? `${value}%` : value;
    })
    .join(', ');
  return `${colorSpace}(${valueString})`;
};

const toArrayFromHslObject = (
  o: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  return mapInputHslValues(Object.values(o)).filter((v) => {
    return typeof v !== 'undefined' && v !== null && !isNaN(v);
  });
};

const toObjectFromHslObject = (o: {}) => {
  const keys = Object.keys(o);
  const arr = toArrayFromHslObject(o);
  return arr.reduce((acc: { [x: string]: any }, value: any, i: number) => {
    const key = i === 3 ? 'a' : keys[i];
    acc[key] = value;
    return acc;
  }, {});
};

const toStringFromHslObject = (o: {}) => {
  const values = toArrayFromHslObject(o)
    .map((value: any, i: number) => {
      return i === 0 ? `${value}deg` : i < 3 ? `${value}%` : value;
    })
    .join(', ');

  return `hsl(${values})`;
};

export const parseHsl = (input: string | {}) => {
  const array =
    typeof input === 'string'
      ? toArrayFromHslString(input)
      : toArrayFromHslObject(input);
  const object =
    typeof input === 'string'
      ? toObjectFromHslString(input)
      : toObjectFromHslObject(input);
  const css =
    typeof input === 'string'
      ? toStringFromHslString(input)
      : toStringFromHslObject(input);

  return {
    array: (): number[] => array,
    object: (): { [x: string]: any } => object,
    css: (): string => css,
  };
};
