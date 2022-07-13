import { parseHsl, isHsl } from './hsl-new';
import { parseRgb, isRgb, getColorSpace } from './rgb-new';
import { parseHex, isHex } from './hex-new';
import { convert } from './convert';
import { HslColor, RgbColor } from './interfaces';
import { COLOR_NAMES } from './color-names';

const toFloat = (n) => Math.round(n * 100) / 100;

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
  const convertedHsl = convert.hex2hsl(hex);
  const convertedRgb = convert.hex2rgb(hex);
  return {
    hex,
    rgb: parseRgb(convertedRgb),
    hsl: parseHsl(convertedHsl),
  };
};

const isNamedColor = (s: string) => {
  return !!COLOR_NAMES[s];
};

const handleNamedColor = (input: string) => {
  const hex = COLOR_NAMES[input];
  const convertedRgb = convert.hex2rgb(hex);
  const convertedHsl = convert.hex2hsl(hex);
  return {
    hex: COLOR_NAMES[input],
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

const parseColor = (input: string | {}) => {
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
    return handleError(input);
  }
};

interface ColorInterface {
  hex: string;
  rgb: {};
  hsl: {};
}

export class Color implements ColorInterface {
  value: string;
  hex: string;
  rgb: {
    array(): number[];
    object(): { r: number; g: number; b: number; a?: number };
  };

  hsl: {
    array(): number[];
    object(): { h: number; s: number; l: number; a?: number };
  };

  constructor(input: string | {}) {
    this.init(input);
  }

  init(input: any) {
    const color = parseColor(input);
    this.hsl = color.hsl;
    this.rgb = color.rgb;
    this.hex = color.hex;
    this.value = color.hex;
  }

  luminance() {
    const a = this.rgb.array().map((v: number) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  contrast(color) {
    color = color instanceof Color ? color : new Color(color);
    const lum1 = color.luminance();
    const lum2 = this.luminance();
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return toFloat((brightest + 0.05) / (darkest + 0.05));
  }

  hue(amount: number, clone: boolean, set: boolean) {
    let { h, s, l, a } = this.hsl.object();
    h = set ? amount : h + amount;
    if (clone || set) {
      return new Color({ h, s, l, a });
    }
    this.init({ h, s, l, a });
    return this;
  }

  saturation(amount: number, clone: boolean, set: boolean) {
    let { h, s, l, a } = this.hsl.object();
    s = set ? amount : s + amount;
    if (clone || set) {
      return new Color({ h, s, l, a });
    }
    this.init({ h, s, l, a });
    return this;
  }

  lightness(amount: number, clone: boolean, set: boolean) {
    let { h, s, l, a } = this.hsl.object();
    l = set ? amount : l + amount;
    if (clone || set) {
      return new Color({ h, s, l, a });
    }
    this.init({ h, s, l, a });
    return this;
  }

  red(amount: number, clone: boolean, set: boolean) {
    let { r, g, b, a } = this.rgb.object();
    r = set ? amount : r + amount;
    if (clone || set) {
      return new Color({ r, g, b, a });
    }
    this.init({ r, g, b, a });
    return this;
  }

  green(amount: number, clone: boolean, set: boolean) {
    let { r, g, b, a } = this.rgb.object();
    g = set ? amount : g + amount;
    if (clone || set) {
      return new Color({ r, g, b, a });
    }
    this.init({ r, g, b, a });
    return this;
  }

  blue(amount: number, clone: boolean, set: boolean) {
    let { r, g, b, a } = this.rgb.object();
    b = set ? amount : b + amount;
    if (clone || set) {
      return new Color({ r, g, b, a });
    }
    this.init({ r, g, b, a });
    return this;
  }

  shades(dataType = 'array', step = 0.5, limit, colorSpace = 'hex') {
    const shades = [];
    let { h, s, l, a } = this.hsl.object();
    while (l > 0) {
      l = toFloat(l - step);
      const shade = parseColor({ h, s, l, a });
      shades.push(shade[colorSpace][dataType]());
      const count = shades.length;
      if (limit && count === limit) {
        break;
      }
    }
    return [...new Set(shades)];
  }

  tints(step = 0.2, limit, colorSpace = 'hex') {
    const tints = [];
    let { h, s, l, a } = this.hsl.object();
    while (l < 100) {
      l = toFloat(l + step);
      const tint = new Color({ h, s, l, a });
      tints.push(tint[colorSpace].css());
      const count = tints.length;
      if (limit && count === limit) {
        break;
      }
    }
    return [...new Set(tints)];
  }

  faded(step = 1, limit, colorSpace = 'hex') {
    let { h, s, l, a } = this.hsl.object();
    const tones = [];
    while (s >= 0) {
      s = toFloat(s - step);
      const tone = new Color({ h, s, l, a });
      tones.push(tone[colorSpace].css());
      const count = tones.length;
      if (limit && count === limit) {
        break;
      }
    }
    return tones;
  }

  vibrant(step = 1, limit, colorSpace = 'hex') {
    let { h, s, l, a } = this.hsl.object();
    const tones = [];
    while (s <= 100) {
      s = toFloat(s + step);
      const tone = new Color({ h, s, l, a });
      tones.push(tone[colorSpace].css());
      const count = tones.length;
      if (limit && count === limit) {
        break;
      }
    }
    return tones;
  }
}

interface ThemeInterface extends ColorInterface {
  analagous(colorSpace: string): {};
  triadic(colorSpace: string): {};
  compound(colorSpace: string): {};
  tetradic(colorSpace: string): {};
}

export class Theme extends Color implements ThemeInterface {
  rgb: any;
  hsl: any;
  hex: any;
  constructor(input: any) {
    super(input);
    const { rgb, hsl, hex } = parseColor(input);
    this.rgb = rgb;
    this.hsl = hsl;
    this.hex = hex;
  }

  rotate(amount: number) {
    const { h } = this.hsl.object();
    return h + amount;
  }

  create(amount: number) {
    let { h, s, l, a } = this.hsl.object();
    h = this.rotate(amount);
    return parseColor({ h, s, l, a });
  }

  analagous(colorSpace = 'rgb') {
    const left = this.create(-30)[colorSpace].css();
    const right = this.create(30)[colorSpace].css();
    const middle = this[colorSpace].css();
    return [ left, middle, right ];
  }

  triadic(colorSpace = 'rgb') {
    const left = this.create(-120)[colorSpace].css();
    const right = this.create(120)[colorSpace].css();
    const middle = this[colorSpace].css();
    return [ left, middle, right ];
  }

  compound(colorSpace = 'rgb') {
    const left = this.create(150)[colorSpace].css();
    const right = this.create(210)[colorSpace].css();
    const middle = this[colorSpace].css();
    return [ left, middle, right ];
  }

  tetradic(colorSpace = 'rgb') {
    const left = this.create(300)[colorSpace].css();
    const right = this.create(120)[colorSpace].css();
    const middle = this.create(180)[colorSpace].css();
    const current = this[colorSpace].css();
    return [ left, middle, current, right ];
  }
}
