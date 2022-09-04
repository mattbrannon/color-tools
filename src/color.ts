import {
  ColorMethods,
  ColorInterface,
  PreferedColorSpace,
  PreferedDataType,
  Config,
  ColorInput,
} from './interfaces';
import { getColorSpace, toFloat } from './utils';
import { parseColor } from './color-parsers';

const acceptedColorSpaces = [ 'hex', 'rgb', 'hsl' ];

export class Color implements ColorInterface {
  hex: ColorMethods;
  rgb: ColorMethods;
  hsl: ColorMethods;

  #colorSpace: PreferedColorSpace;
  #dataType: PreferedDataType;

  /**
   * @param {string|{}} color   css color string or color object
   *  - Accepts any valid CSS color string.
   *  - Accepts an object representation of an RGB or HSL color.

   * @example
   * new Color('red')
   * new Color('hsl(220deg, 88%, 35%, 0.8)')
   * new Color('rgb(110, 90, 200)')
   * new Color('#ba88а7')
   * new Color({ h:220, s:88, l:35, a:0.8 })
   * new Color({ r:110, g:90, b: 200 })
   */

  // TODO: handle hex input like 0x09f;
  constructor(color: ColorInput, config?: Config) {
    const methods = parseColor(color, config);
    if (!methods) {
      throw new Error(`Unrecognized color ${JSON.stringify(color)}`);
    }
    this.hex = methods.hex;
    this.rgb = methods.rgb;
    this.hsl = methods.hsl;

    if (config) {
      if (acceptedColorSpaces.includes(config.colorSpace)) {
        this.colorSpace = config.colorSpace;
      }
      else {
        const colorSpace = getColorSpace(color) as PreferedColorSpace;
        this.colorSpace = colorSpace;

        const warning = [
          `${config.colorSpace} is not a recognized color space`,
          `Using calculated value ${colorSpace} instead`,
        ].join('\n');

        console.warn(warning);
      }
      this.dataType = config.dataType || (color as PreferedDataType);
    }
    else {
      this.colorSpace = getColorSpace(color) as PreferedColorSpace;
      this.dataType = color as PreferedDataType;
    }

    this.#colorSpace = this.colorSpace;
    this.#dataType = this.dataType;
    return this;
  }

  /**
   * @returns {string} A random css hex color string
   */
  static random(): string {
    return `#${Math.random().toString(16).slice(2, 8)}`;
  }

  /**
   * @returns {number} The contrast ratio between two colors
   */
  static contrast(color1: string | Color, color2: string | Color): number {
    try {
      color1 = color1 instanceof Color ? color1 : new Color(color1);
      color2 = color2 instanceof Color ? color2 : new Color(color2);
      const lum1 = color1.luminance();
      const lum2 = color2.luminance();
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return toFloat((brightest + 0.05) / (darkest + 0.05));
    }
    catch (error: any) {
      return error.message;
    }
  }

  set dataType(value: PreferedDataType) {
    const type =
      Array.isArray(value) || value === 'array'
        ? 'array'
        : typeof value === 'object' || value === 'object'
        ? 'object'
        : 'css';

    this.#dataType = type;
  }

  get dataType() {
    return this.#dataType;
  }

  set colorSpace(value: PreferedColorSpace) {
    const colorSpace =
      value === 'hsl' || value === 'rgb' || value === 'hex'
        ? value
        : this.colorSpace;

    this.#colorSpace = colorSpace;
  }

  get colorSpace() {
    return this.#colorSpace;
  }

  #getCurrent() {
    const colorMethod = this[this.colorSpace][this.dataType];
    return colorMethod();
  }

  value() {
    return this.#getCurrent();
  }

  /**
   * @returns {number} The calculated luminance of the color between [0, 1].
   */
  luminance(): number {
    const a = this.rgb.array().map((v: number) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  /**
   * @param {string|Color} color -
   * - any valid css color
   * - an object representing an HSL or RGB color
   * - another instance of Color
   * @returns The contrast ratio between the two colors
   */

  contrast(color: Color | string): number {
    color = color instanceof Color ? color : new Color(color);
    const lum1 = color.luminance();
    const lum2 = this.luminance();
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return toFloat((brightest + 0.05) / (darkest + 0.05));
  }

  /**
   * @param {number} amount - set hue relative to the current value
   * @returns A new instance of Color
   */

  hue(amount: number = 0): Color {
    const { h, s, l, a } = this.hsl.object();
    const H = h + amount;
    const hsl = a ? { h: H, s, l, a } : { h: H, s, l };

    return new Color(hsl, {
      dataType: this.#dataType,
      colorSpace: this.#colorSpace,
    });
  }

  /**
   * @param {number} amount - set saturation relative to the current value
   * @returns A new instance of Color
   */

  saturation(amount: number = 0): Color {
    const { h, s, l, a } = this.hsl.object();
    const S = s + amount;
    const hsl = a ? { h, s: S, l, a } : { h, s: S, l };

    return new Color(hsl, {
      dataType: this.#dataType,
      colorSpace: this.#colorSpace,
    });
  }

  /**
   * @param {number} amount - set lightness relative to the current value
   * @returns A new instance of Color
   */

  lightness(amount: number = 0): Color {
    const { h, s, l, a } = this.hsl.object();
    const L = l + amount;
    const hsl = a ? { h, s, l: L, a } : { h, s, l: L };
    return new Color(hsl, {
      dataType: this.#dataType,
      colorSpace: this.#colorSpace,
    });
  }

  /**
   * @param {number} amount - set red channel relative to the current value
   * @returns A new instance of Color
   */

  red(amount: number = 0) {
    const { r, g, b, a } = this.rgb.object();
    const R = r + amount;
    const rgb = a ? { r: R, g, b, a } : { r: R, g, b };

    return new Color(rgb, {
      dataType: this.#dataType,
      colorSpace: this.#colorSpace,
    });
  }

  /**
   * @param {number} amount - set green channel relative to the current value
   * @returns A new instance of Color
   */

  green(amount: number = 0) {
    const { r, g, b, a } = this.rgb.object();
    const G = g + amount;
    const rgb = a ? { r, g: G, b, a } : { r, g: G, b };

    return new Color(rgb, {
      dataType: this.#dataType,
      colorSpace: this.#colorSpace,
    });
  }

  /**
   * @param {number} amount - set blue channel relative to the current value
   * @returns A new instance of Color
   */
  blue(amount: number = 0) {
    const { r, g, b, a } = this.rgb.object();
    const B = b + amount;
    const rgb = a ? { r, g, b: B, a } : { r, g, b: B };

    return new Color(rgb, {
      dataType: this.#dataType,
      colorSpace: this.#colorSpace,
    });
  }

  #getTone(obj: string | {}) {
    const { colorSpace, dataType } = this;
    // @ts-ignore
    return parseColor(obj)[colorSpace][dataType]();
  }

  /**
   * @param {number} [limit] - set a limit on the number of values produced.
   * @param {number} [step] - control the rate of change
   * @return an array of colors
   */
  shades(limit?: number, step: number = 1) {
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

  /**
   * @param {number} [limit] - set a limit on the number of values produced.
   * @param {number} [step] - control the rate of change
   * @return an array of colors
   */
  tints(limit?: number, step: number = 1) {
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

  /**
   * @param {number} [limit] - set a limit on the number of values produced.
   * @param {number} [step] - control the rate of change
   * @return an array of colors
   */

  faded(limit?: number, step: number = 1) {
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

  /**
   * @param {number} [limit] - set a limit on the number of values produced.
   * @param {number} [step] - control the rate of change
   * @return an array of colors
   */

  vibrant(limit?: number, step: number = 1) {
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
