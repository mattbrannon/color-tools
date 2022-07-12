//@ts-ignore
import convert from './converter';
//@ts-ignore
import { parseRgbString, parseRgbObject } from './rgb.js';
//@ts-ignore
import { parseHslString, parseHslObject } from './hsl.js';
//@ts-ignore
import { parseHexString } from './hex.js';
import { getColorSpace } from './utils.js';

interface HslColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export class Color {
  input: string | HslColor | RgbColor;
  colorSpace: string;
  private _hex: string;
  private _rgb: object;
  private _hsl: object;

  constructor(input: string | HslColor | RgbColor) {
    this.input = input;
    this.colorSpace = getColorSpace(input);
    this.init();
    this._hex = ''
    this._hsl = {}
    this._rgb = {}
  }

  get hex() {
    return this._hex;
  }

  get rgb() {
    return this._rgb;
  }

  get hsl() {
    return this._hsl;
  }

  set hex(value) {
    this._hex = value;
  }

  set rgb(value) {
    this._rgb = value;
  }

  set hsl(value) {
    this._hsl = value;
  }

  private init() {
    if (this.colorSpace === 'rgb') {
      const rgb =
        typeof this.input === 'string'
          ? parseRgbString(this.input)
          : parseRgbObject(this.input);

      if (typeof this.input === 'string') {
        const hsl = convert.rgb2hsl(rgb.object());
        const hex = convert.rgb2hex(rgb.object());
        this.rgb = rgb;
        this._hex = hex;
        this._hsl = parseHslObject(hsl);
      }
      else if (typeof this.input === 'object') {
        const hsl = convert.rgb2hsl(rgb.object());
        this.rgb = rgb;
        this._hsl = parseHslObject(hsl);
        this._hex = convert.rgb2hex(rgb.object());
      }
    }
    else if (this.colorSpace === 'hsl') {
      if (typeof this.input === 'string') {
        const hsl = parseHslString(this.input);
        const rgb = convert.hsl2rgb(hsl.object());
        this._hsl = hsl;
        this._hex = convert.hsl2hex(hsl.object());
        this._rgb = parseRgbObject(rgb);
      }
      else if (typeof this.input === 'object') {
        const hsl = parseHslObject(this.input);
        const rgb = convert.hsl2rgb(hsl.object());
        this._hsl = hsl;
        this._rgb = parseRgbObject(rgb);
        this._hex = convert.rgb2hex(rgb);
      }
    }
    else if (this.colorSpace === 'hex') {
      if (typeof this.input === 'string') {
        this._hex = parseHexString(this.input);
        const rgb = convert.hex2rgb(this.hex);
        this._rgb = parseRgbObject(rgb);
        const hsl = convert.hex2hsl(this.hex);
        this._hsl = parseHslObject(hsl);
      }
    }
    return this;
  }
}

// const color = new Color('r g b(  34, 212, 58, 0 .  5');
// console.log(color);

// @ts-ignore
// console.log(color.hsl.object());
