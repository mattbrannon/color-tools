import { parseHsl } from './hsl-new';
import { parseRgb } from './rgb-new';
import { parseHex } from './hex-new';
import { convert } from './convert';
import { HslColor, RgbColor } from './interfaces';
import { COLOR_NAMES } from './color-names';
import { isHex, isRgb, isHsl, isNamedColor, getColorSpace } from './utils';

const handleHsl = (input: string | {}) => {
  const hsl = parseHsl(input);
  const convertedRgb = convert.hsl2rgb(hsl.object() as HslColor);
  const convertedHex = convert.hsl2hex(hsl.object() as HslColor);
  return {
    hsl,
    rgb: parseRgb(convertedRgb),
    hex: parseHex(convertedHex),
  };
};

const handleRgb = (input: string | {}) => {
  const rgb = parseRgb(input);
  const convertedHsl = convert.rgb2hsl(rgb.object() as RgbColor);
  const convertedHex = convert.rgb2hex(rgb.object() as RgbColor);
  return {
    rgb,
    hsl: parseHsl(convertedHsl),
    hex: parseHex(convertedHex),
  };
};

const handleHex = (input: string | {}) => {
  const hex = parseHex(input as string);
  const convertedHsl = convert.hex2hsl(hex.css());
  const convertedRgb = convert.hex2rgb(hex.css());
  return {
    hex,
    rgb: parseRgb(convertedRgb),
    hsl: parseHsl(convertedHsl),
  };
};

const handleNamedColor = (input: string) => {
  const hex = parseHex(COLOR_NAMES[input]);
  const convertedRgb = convert.hex2rgb(hex.css());
  const convertedHsl = convert.hex2hsl(hex.css());
  return {
    hex,
    rgb: parseRgb(convertedRgb),
    hsl: parseHsl(convertedHsl),
  };
};

const handleError = (input: string | {}) => {
  const colorSpace = getColorSpace(input);
  return {
    error: true,
    message: `${colorSpace} is not recognized`,
    hex: null,
    rgb: null,
    hsl: null,
  };
};

export const parseColor = (input: string | {}) => {
  return isHsl(input)
    ? handleHsl(input)
    : isRgb(input)
    ? handleRgb(input)
    : isHex(input)
    ? handleHex(input)
    : isNamedColor(input as string)
    ? handleNamedColor(input as string)
    : handleError(input);
};
