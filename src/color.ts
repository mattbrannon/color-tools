import { ColorMethods, ColorInterface } from './interfaces.js';
import { getColorSpace, toFloat } from './utils.js';
import { parseColor, init } from './color-parsers.js';

type PreferedDataType = 'array' | 'object' | 'css' | {} | any[];

export class Color implements ColorInterface {
  hex: ColorMethods;
  rgb: ColorMethods;
  hsl: ColorMethods;

  #_colorSpace: string;
  #_dataType: PreferedDataType;

  constructor(input: string | {}) {
    const methods = init(input);
    this.hex = methods.hex;
    this.rgb = methods.rgb;
    this.hsl = methods.hsl;
    this.colorSpace = getColorSpace(input);
    this.dataType = input;
  }

  set dataType(value: PreferedDataType) {
    const type =
      Array.isArray(value) || value === 'array'
        ? 'array'
        : typeof value === 'object' || value === 'object'
        ? 'object'
        : 'css';

    this.#_dataType = type;
  }

  get dataType() {
    return this.#_dataType;
  }

  set colorSpace(value) {
    const colorSpace =
      value === 'hsl' || value === 'rgb' || value === 'hex'
        ? value
        : this.colorSpace;

    this.#_colorSpace = colorSpace;
  }

  get colorSpace() {
    return this.#_colorSpace;
  }

  #init(input: any) {
    const color = parseColor(input);
    this.hsl = color.hsl;
    this.rgb = color.rgb;
    this.hex = color.hex;
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
      return parseColor({ h, s, l, a });
    }
    this.#init({ h, s, l, a });
    return this;
  }

  saturation(amount: number, clone: boolean, set: boolean) {
    let { h, s, l, a } = this.hsl.object();
    s = set ? amount : s + amount;
    if (clone || set) {
      return parseColor({ h, s, l, a });
    }
    this.#init({ h, s, l, a });
    return this;
  }

  lightness(amount: number, clone: boolean, set: boolean) {
    let { h, s, l, a } = this.hsl.object();
    l = set ? amount : l + amount;
    if (clone || set) {
      return parseColor({ h, s, l, a });
    }
    this.#init({ h, s, l, a });
    return this;
  }

  red(amount: number, clone: boolean, set: boolean) {
    let { r, g, b, a } = this.rgb.object();
    r = set ? amount : r + amount;
    if (clone || set) {
      return parseColor({ r, g, b, a });
    }
    this.#init({ r, g, b, a });
    return this;
  }

  green(amount: number, clone: boolean, set: boolean) {
    let { r, g, b, a } = this.rgb.object();
    g = set ? amount : g + amount;
    if (clone || set) {
      return parseColor({ r, g, b, a });
    }
    this.#init({ r, g, b, a });
    return this;
  }

  blue(amount: number, clone: boolean, set: boolean) {
    let { r, g, b, a } = this.rgb.object();
    b = set ? amount : b + amount;
    if (clone || set) {
      return parseColor({ r, g, b, a });
    }
    this.#init({ r, g, b, a });
    return this;
  }

  #getTone(obj: string | {}) {
    const { colorSpace, dataType } = this;
    return parseColor(obj)[colorSpace][dataType]();
  }

  shades(step = 0.5, limit: number) {
    const shades = [];
    let { h, s, l, a } = this.hsl.object();
    while (l > 0) {
      l = toFloat(l - step);
      const shade = this.#getTone({ h, s, l, a });
      shades.push(shade);
      if (limit && shades.length === limit) {
        break;
      }
    }
    return [...new Set(shades)];
  }

  tints(step = 0.2, limit: number) {
    const tints = [];
    let { h, s, l, a } = this.hsl.object();
    while (l < 100) {
      l = toFloat(l + step);
      const tint = this.#getTone({ h, s, l, a });
      tints.push(tint);
      if (limit && tints.length === limit) {
        break;
      }
    }
    return [...new Set(tints)];
  }

  faded(step = 1, limit: number) {
    let { h, s, l, a } = this.hsl.object();
    const tones = [];
    while (s >= 0) {
      s = toFloat(s - step);
      const tone = this.#getTone({ h, s, l, a });
      tones.push(tone);
      if (limit && tones.length === limit) {
        break;
      }
    }
    return tones;
  }

  vibrant(step = 1, limit: number) {
    let { h, s, l, a } = this.hsl.object();
    const tones = [];
    while (s <= 100) {
      s = toFloat(s + step);
      const tone = this.#getTone({ h, s, l, a });
      tones.push(tone);
      if (limit && tones.length === limit) {
        break;
      }
    }
    return tones;
  }
}
