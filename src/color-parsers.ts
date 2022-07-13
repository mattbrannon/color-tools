import { parseHsl } from './hsl-new.js';
import { parseRgb } from './rgb-new.js';
import { parseHex } from './hex-new.js';
import { convert } from './convert.js';
import { HslColor, RgbColor } from './interfaces.js';
import { COLOR_NAMES } from './color-names.js';
import { isHex, isRgb, isHsl, isNamedColor, getColorSpace } from './utils.js';

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
  try {
    const colorSpace = getColorSpace(input);
    return {
      error: true,
      message: 'Not recognized',
      colorSpace,
      hex: null,
      rgb: null,
      hsl: null,
    };
  }
  catch (error: any) {
    console.error(error.message);
  }
  finally {
    const colorSpace = getColorSpace(input);
    // eslint-disable-next-line no-unsafe-finally
    return {
      error: true,
      message: 'Not recognized',
      colorSpace,
      hex: null,
      rgb: null,
      hsl: null,
    };
  }
};

export const parseColor = (input: string | {}) => {
  try {
    return isHsl(input)
      ? handleHsl(input)
      : isRgb(input)
      ? handleRgb(input)
      : isHex(input)
      ? handleHex(input)
      : isNamedColor(input as string)
      ? handleNamedColor(input as string)
      : handleError(input);
  }
  catch (error: any) {
    console.log(error);
    return handleError(input);
  }
};

export const init = (input: any) => {
  const { hex, rgb, hsl } = parseColor(input);
  return { hex, rgb, hsl };
};
