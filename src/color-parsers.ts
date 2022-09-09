import { Config, ColorInput } from './interfaces';
import { COLOR_NAMES } from './color-names';

import { parseHsl } from './hsl';
import { parseRgb } from './rgb';
import { parseHex } from './hex';

import { isHex, isRgb, isHsl, isNamedColor } from './utils';
import {
  hslToRgb,
  hslToHex,
  rgbToHsl,
  rgbToHex,
  hexToHsl,
  hexToRgb,
} from './convert';

const handleHsl = (input: ColorInput) => {
  const hsl = parseHsl(input);
  const convertedRgb = hslToRgb(hsl.array() as number[]);
  const convertedHex = hslToHex(hsl.array() as number[]);
  return {
    hsl,
    rgb: parseRgb(convertedRgb),
    hex: parseHex(convertedHex),
  };
};

const handleRgb = (input: ColorInput) => {
  const rgb = parseRgb(input);
  const convertedHsl = rgbToHsl(rgb.array());
  const convertedHex = rgbToHex(rgb.array());
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
  if (Array.isArray(input) && (!config || !config.colorSpace)) {
    throw new Error(
      `Unable to determine color space from array. 
        Please supply a configuration object with a valid color space`
    );
  }

  const callback =
    isHsl(input) || config?.colorSpace === 'hsl'
      ? handleHsl(input)
      : isRgb(input) || config?.colorSpace === 'rgb'
      ? handleRgb(input)
      : isHex(input) || config?.colorSpace === 'hex'
      ? handleHex(input)
      : isNamedColor(input as string)
      ? handleNamedColor(input as keyof typeof COLOR_NAMES)
      : null;

  return callback;
};
