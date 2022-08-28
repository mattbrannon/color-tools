import {
  HslObject,
  RgbObject,
  Config,
  ColorInput,
  HslInput,
  RgbInput,
} from './interfaces';
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

const handleHsl = (input: HslInput) => {
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
  const convertedHsl = rgbToHsl(rgb.object() as RgbObject);
  const convertedHex = rgbToHex(rgb.object() as RgbObject);
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

// TODO handle hex values like 0x0f9
export const parseColor = (input: ColorInput, config?: Config) => {
  const acceptedColorSpaces = [ 'rgb', 'hsl', 'hex' ];

  if (config) {
    if (Array.isArray(input)) {
      if (!config.colorSpace) {
        throw new Error(
          'Unable to determine color space from array. Please supply a configuration object with a valid color space'
        );
      }
      else if (acceptedColorSpaces.includes(config.colorSpace)) {
        if (config.colorSpace === 'hsl') {
          return handleHsl(input as HslInput);
        }
        else if (config.colorSpace === 'rgb') {
          return handleRgb(input as RgbInput);
        }
        else if (config.colorSpace === 'hex') {
          return handleHex(input);
        }
      }
    }
  }

  const callback = isHsl(input)
    ? handleHsl(input as HslInput)
    : isRgb(input)
    ? handleRgb(input)
    : isHex(input)
    ? handleHex(input)
    : isNamedColor(input as string)
    ? handleNamedColor(input as keyof typeof COLOR_NAMES)
    : null;

  return callback;
};
