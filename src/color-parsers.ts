import { HslObject, RgbColor } from './interfaces';
import { COLOR_NAMES } from './color-names';

import { parseHsl } from './hsl-new';
import { parseRgb } from './rgb-new';
import { parseHex } from './hex-new';

import { isHex, isRgb, isHsl, isNamedColor } from './utils';
import {
  hslToRgb,
  hslToHex,
  rgbToHsl,
  rgbToHex,
  hexToHsl,
  hexToRgb,
} from './convert';

const handleHsl = (input: string | HslObject) => {
  const hsl = parseHsl(input);
  const convertedRgb = hslToRgb(hsl.object() as HslObject);
  const convertedHex = hslToHex(hsl.object() as HslObject);
  return {
    hsl,
    rgb: parseRgb(convertedRgb),
    hex: parseHex(convertedHex),
  };
};

const handleRgb = (input: string | {}) => {
  const rgb = parseRgb(input);
  const convertedHsl = rgbToHsl(rgb.object() as RgbColor);
  const convertedHex = rgbToHex(rgb.object() as RgbColor);
  return {
    rgb,
    hsl: parseHsl(convertedHsl),
    hex: parseHex(convertedHex),
  };
};

const handleHex = (input: string | {}) => {
  const hex = parseHex(input as string);
  const convertedHsl = hexToHsl(hex.css());
  const convertedRgb = hexToRgb(hex.css());
  return {
    hex,
    rgb: parseRgb(convertedRgb),
    hsl: parseHsl(convertedHsl),
  };
};

const handleNamedColor = (input: keyof typeof COLOR_NAMES) => {
  const hex = parseHex(COLOR_NAMES[input]);
  const convertedRgb = hexToRgb(hex.css());
  const convertedHsl = hexToHsl(hex.css());
  return {
    hex,
    rgb: parseRgb(convertedRgb),
    hsl: parseHsl(convertedHsl),
  };
};

export const parseColor = (input: any | {}) => {
  const callback = isHsl(input)
    ? handleHsl(input)
    : isRgb(input)
    ? handleRgb(input)
    : isHex(input)
    ? handleHex(input)
    : isNamedColor(input as string)
    ? handleNamedColor(input)
    : null;

  return callback;
};
