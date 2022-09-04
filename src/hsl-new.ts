import { InputArray, HslArray, HslObject } from './interfaces';
import {
  keepAlphaInRange,
  keepPercentInRange,
  keepHueInRange,
  parseString,
  toFloat,
} from './utils';

import { gradian, radian, degree, turn } from './angles';

const getAngleType = (hue: any) => {
  try {
    const angle = hue.match(/[a-z]+/g)?.join('') ?? 'deg';
    return angle;
  }
  catch {
    return 'deg';
  }
};

export const normalize = (angleType: string) => {
  const conversionFn =
    angleType === 'turn'
      ? turn.toDegree
      : angleType === 'grad'
      ? gradian.toDegree
      : angleType === 'rad'
      ? radian.toDegree
      : degree.toDegree;

  return conversionFn;
};

const mapInputHslValues = (values: number[] | string[]) => {
  if (values.length < 3 || values.length > 4) {
    throw Error(`Must contain 3 or 4 values. Received ${values.length}`);
  }
  return values.map((value: any, i): number => {
    const isAlpha = i === 3;
    const isHue = i === 0;
    const isPercent = typeof value === 'string' && value.endsWith('%');

    if (isHue) {
      const angleType = getAngleType(value);
      const convertAngle = normalize(angleType);
      const n = parseFloat(value as string);
      const h = convertAngle(n);
      const hue = keepHueInRange(h);
      return toFloat(hue);
    }
    else if (isAlpha && !isPercent) {
      const alpha = keepAlphaInRange(value as number);
      return alpha;
    }
    else if (isAlpha && isPercent) {
      const n = parseInt(value) / 100;
      const alpha = keepAlphaInRange(n);
      return alpha;
    }
    else {
      return keepPercentInRange(parseFloat(value as string));
    }
  });
};

export const parseInputHslString = (hsl: string) => {
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

const toObjectFromHslString = (s: string): HslObject => {
  const { colorSpace, colorValues } = parseInputHslString(s);
  return colorValues.reduce((acc, value, i) => {
    type HslKey = keyof HslObject;

    const key = i === 3 ? 'a' : colorSpace[i];
    // @ts-ignore
    acc[key as HslKey] = value;
    return acc;
  }, {} as HslObject);
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

const toArrayFromHslObject = (o: HslObject) => {
  const values = Object.values(o);
  const array = mapInputHslValues(values as InputArray).filter((v) => {
    return typeof v !== 'undefined' && v !== null && !isNaN(v);
  });
  return array;
};

const toObjectFromHslObject = (o: HslObject) => {
  const keys = Object.keys(o);
  const arr = toArrayFromHslObject(o);
  return arr.reduce((acc: { [x: string]: any }, value: any, i: number) => {
    const key = i === 3 ? 'a' : keys[i];
    acc[key] = value;
    return acc;
  }, {});
};

const toStringFromHslObject = (o: HslObject) => {
  const values = toArrayFromHslObject(o)
    .map((value: any, i: number) => {
      return i === 0 ? `${value}deg` : i < 3 ? `${value}%` : value;
    })
    .join(', ');

  return `hsl(${values})`;
};

const toObjectFromHslArray = (arr: number[] | string[]) => {
  return mapInputHslValues(arr).reduce((acc, value, i) => {
    const key: keyof HslObject =
      i === 0 ? 'h' : i === 1 ? 's' : i === 2 ? 'l' : 'a';
    // @ts-ignore
    acc[key] = value;
    return acc;
  }, {} as HslObject);
};

const toStringFromHslArray = (arr: number[] | string[]) => {
  const values = mapInputHslValues(arr).map((value, i) => {
    return i === 0 ? `${value}deg` : i < 3 ? `${value}%` : value;
  });
  console.log(values);

  return `hsl(${values.join(', ')})`;
};

export const parseHsl = (input: any) => {
  const array = Array.isArray(input)
    ? mapInputHslValues(input as InputArray)
    : typeof input === 'string'
    ? toArrayFromHslString(input)
    : toArrayFromHslObject(input);
  const object = Array.isArray(input)
    ? toObjectFromHslArray(input)
    : typeof input === 'string'
    ? toObjectFromHslString(input)
    : toObjectFromHslObject(input);
  const css = Array.isArray(input)
    ? toStringFromHslArray(input)
    : typeof input === 'string'
    ? toStringFromHslString(input)
    : toStringFromHslObject(input);

  return {
    array: (): HslArray => array as HslArray,
    object: (): HslObject => object as HslObject,
    css: (): string => css,
  };
};
