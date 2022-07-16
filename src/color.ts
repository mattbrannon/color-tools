import { ColorMethods, ColorInterface } from './interfaces';
import { getColorSpace, toFloat } from './utils';
import { parseColor } from './color-parsers';

type PreferedDataType = 'array' | 'object' | 'css' | {} | any[];

export class Color implements ColorInterface {
  hex: ColorMethods;
  rgb: ColorMethods;
  hsl: ColorMethods;

  #_colorSpace: string;
  #_dataType: PreferedDataType;

  /**
   * @param {string|{}} input   css color string or color object
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
  constructor(input: string | {}) {
    const methods = parseColor(input);
    this.hex = methods.hex;
    this.rgb = methods.rgb;
    this.hsl = methods.hsl;
    this.colorSpace = getColorSpace(input);
    this.dataType = input;
    return this;
  }

  /**
   * @returns A random css hex color string
   */
  static random() {
    return `#${Math.random().toString(16).slice(2, 8)}`;
  }

  /**
   * @returns {number} The contrast ratio between two colors
   */
  static contrast(color1, color2): number {
    color1 = color1 instanceof Color ? color1 : new Color(color1);
    color2 = color2 instanceof Color ? color2 : new Color(color2);
    const lum1 = color1.luminance();
    const lum2 = color2.luminance();
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return toFloat((brightest + 0.05) / (darkest + 0.05));
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
   * @param {string|{}|Color} color -
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
   * @param {boolean} [useAbsolute] - set to true to set an absolute value
   * @returns A new instance of Color
   */

  hue(amount: number, useAbsolute: boolean): Color {
    let { h, s, l, a } = this.hsl.object();
    h = useAbsolute ? amount : h + amount;
    return new Color({ h, s, l, a });
  }

  /**
   *
   * @param {number} amount - set saturation relative to the current value
   * @param {boolean} [useAbsolute] - set to true to set an absolute value
   * @returns A new instance of Color
   */

  saturation(amount: number, useAbsolute: boolean): Color {
    let { h, s, l, a } = this.hsl.object();
    s = useAbsolute ? amount : s + amount;
    return new Color({ h, s, l, a });
  }

  /**
   *
   * @param {number} amount - set lightness relative to the current value
   * @param {boolean} [useAbsolute] - set to true to set an absolute value
   * @returns A new instance of Color
   */

  lightness(amount: number, useAbsolute: boolean): Color {
    let { h, s, l, a } = this.hsl.object();
    l = useAbsolute ? amount : l + amount;
    return new Color({ h, s, l, a });
  }

  /**
   * @param {number} amount - set red channel relative to the current value
   * @param {boolean} [useAbsolute] - set to true to set an absolute value
   * @returns A new instance of Color
   */

  red(amount: number, useAbsolute: boolean) {
    let { r, g, b, a } = this.rgb.object();
    r = useAbsolute ? amount : r + amount;
    return new Color({ r, g, b, a });
  }

  /**
   * @param {number} amount - set green channel relative to the current value
   * @param {boolean} [useAbsolute] - set to true to set an absolute value
   * @returns A new instance of Color
   */

  green(amount: number, useAbsolute: boolean) {
    let { r, g, b, a } = this.rgb.object();
    g = useAbsolute ? amount : g + amount;
    return new Color({ r, g, b, a });
  }

  /**
   * @param {number} amount - set blue channel relative to the current value
   * @param {boolean} [useAbsolute] - set to true to set an absolute value
   * @returns A new instance of Color
   */

  blue(amount: number, useAbsolute: boolean) {
    let { r, g, b, a } = this.rgb.object();
    b = useAbsolute ? amount : b + amount;
    return new Color({ r, g, b, a });
  }

  #getTone(obj: string | {}) {
    const { colorSpace, dataType } = this;
    return parseColor(obj)[colorSpace][dataType]();
  }

  /**
   * Generate an array of darkening colors
   *
   * @param step Controls how much lightness is removed at each iteration
   *
   * @param {number} limit - Optionally set a hard limit on the number of shades produced.
   * @return an array of colors
   */
  shades(step: number = 0.5, limit: number): string[] | {}[] {
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
