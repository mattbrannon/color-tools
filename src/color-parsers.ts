import { HslColor, RgbColor } from './interfaces';
import { COLOR_NAMES } from './color-names';

import { parseHsl } from './hsl-new';
import { parseRgb } from './rgb-new';
import { parseHex } from './hex-new';

import { isHex, isRgb, isHsl, isNamedColor } from './utils';
import {
  hsl2rgb,
  hsl2hex,
  rgb2hsl,
  rgb2hex,
  hex2hsl,
  hex2rgb,
} from './convert';

const handleHsl = (input: string | {}) => {
  const hsl = parseHsl(input);
  const convertedRgb = hsl2rgb(hsl.object() as HslColor);
  const convertedHex = hsl2hex(hsl.object() as HslColor);
  return {
    hsl,
    rgb: parseRgb(convertedRgb),
    hex: parseHex(convertedHex),
  };
};

const handleRgb = (input: string | {}) => {
  const rgb = parseRgb(input);
  const convertedHsl = rgb2hsl(rgb.object() as RgbColor);
  const convertedHex = rgb2hex(rgb.object() as RgbColor);
  return {
    rgb,
    hsl: parseHsl(convertedHsl),
    hex: parseHex(convertedHex),
  };
};

const handleHex = (input: string | {}) => {
  const hex = parseHex(input as string);
  const convertedHsl = hex2hsl(hex.css());
  const convertedRgb = hex2rgb(hex.css());
  return {
    hex,
    rgb: parseRgb(convertedRgb),
    hsl: parseHsl(convertedHsl),
  };
};

const handleNamedColor = (input: keyof typeof COLOR_NAMES) => {
  const hex = parseHex(COLOR_NAMES[input]);
  const convertedRgb = hex2rgb(hex.css());
  const convertedHsl = hex2hsl(hex.css());
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
