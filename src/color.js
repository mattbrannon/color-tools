import { REDX, WARNING, OK, CHECKMARK } from '../constants/unicodes.js';
import convert from '../converter/index.js';
import { hexToArray, hexToObject, validateHex } from '../lib/hex.js';
import { parseHSL } from '../lib/hsl.js';
import { parseRGB } from '../lib/rgb.js';
import {
  isNamedColor,
  isObject,
  isValidHex,
  toFloat,
  stringToObject,
  toString,
} from '../utils/index.js';

function random(n) {
  return Math.floor(Math.random() * (n + 1));
}

function randomAlpha() {
  return Math.round(Math.random() * 100) / 100;
}

function randomRgb(alpha) {
  const length = alpha ? 4 : 3;
  const values = Array.from({ length }, (_, i) =>
    alpha && i === 3 ? randomAlpha() : random(255)
  );

  const color = `rgb(${values.join(', ')})`;
  return color;
}

function randomHsl(alpha) {
  const length = alpha ? 4 : 3;
  const values = Array.from({ length }, (_, i) =>
    i === 0
      ? random(360) + 'deg'
      : alpha && i === length - 1
        ? randomAlpha()
        : random(100) + '%'
  );

  const type = alpha ? 'hsla' : 'hsl';
  const color = `${type}(${values.join(', ')})`;

  return color;
}

function randomHex() {
  const color = `#${Math.random().toString(16).substring(2, 8)}`;

  return color;
}

export default class Color {
  constructor(initialValue) {
    this.initialValue = initialValue;
    this.init(initialValue);
    this.adjust = null;
    this.set = null;
  }

  static random(type) {
    let color;
    if (!type || type === 'hex') {
      return randomHex();
    }
    else if (type === 'hsl' || type === 'hsla') {
      const alpha = type === 'hsla';
      return randomHsl(alpha);
    }
    else if (type === 'rgb' || type === 'rgba') {
      const alpha = type === 'rgba';
      return randomRgb(alpha);
    }

    return color;
  }

  static contrast(color1, color2) {
    color1 = color1 instanceof Color ? color1 : new Color(color1);
    color2 = color2 instanceof Color ? color2 : new Color(color2);
    const lum1 = color1.luminance();
    const lum2 = color2.luminance();
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return toFloat((brightest + 0.05) / (darkest + 0.05));
  }

  static isNamedColor(color) {
    return isNamedColor(color);
  }

  get hex() {
    return this._hex;
  }

  get hsl() {
    return this._hsl;
  }

  get rgb() {
    return this._rgb;
  }

  get adjust() {
    return this._adjust;
  }

  get set() {
    return this._set;
  }

  set hex(value) {
    this._hex = {
      css: () => value,
      array: () => hexToArray(value),
      object: () => hexToObject(value),
      shades: (step, limit) => this.shades(step, limit, 'hex'),
      tints: (step, limit) => this.tints(step, limit, 'hex'),
      faded: (step, limit) => this.faded(step, limit, 'hex'),
      vibrant: (step, limit) => this.vibrant(step, limit, 'hex'),
      random: () => randomHex(),
    };
  }

  set rgb(methods) {
    this._rgb = {
      css: () => methods.css(),
      array: () => methods.array(),
      object: () => methods.object(),
      shades: (step, limit) => this.shades(step, limit, 'rgb'),
      tints: (step, limit) => this.tints(step, limit, 'rgb'),
      faded: (step, limit) => this.faded(step, limit, 'rgb'),
      vibrant: (step, limit) => this.vibrant(step, limit, 'rgb'),
      random: (alpha = false) => randomRgb(alpha),
    };
  }

  set hsl(methods) {
    this._hsl = {
      css: () => methods.css(),
      array: () => methods.array(),
      object: () => methods.object(),
      shades: (dataType, step, limit) =>
        this.shades(dataType, step, limit, 'hsl'),
      tints: (step, limit) => this.tints(step, limit, 'hsl'),
      faded: (step, limit) => this.faded(step, limit, 'hsl'),
      vibrant: (step, limit) => this.vibrant(step, limit, 'hsl'),
      random: (alpha = false) => randomHsl(alpha),
    };
  }

  set adjust(_) {
    this._adjust = {
      hue: (amount) => this.hue(amount, true),
      saturation: (amount) => this.saturation(amount, true),
      lightness: (amount) => this.lightness(amount, true),
      red: (amount) => this.red(amount, true),
      green: (amount) => this.green(amount, true),
      blue: (amount) => this.blue(amount, true),
    };
  }

  set set(_) {
    this._set = {
      hue: (amount) => this.hue(amount, true, true),
      saturation: (amount) => this.saturation(amount, true, true),
      lightness: (amount) => this.lightness(amount, true, true),
      red: (amount) => this.red(amount, true, true),
      green: (amount) => this.green(amount, true, true),
      blue: (amount) => this.blue(amount, true, true),
    };
  }

  init(input) {
    if (isValidHex(input)) {
      this.convertFromHex(input);
    }
    else if (isNamedColor(input)) {
      this.convertFromHex(isNamedColor(input));
    }
    else if (isObject(input)) {
      this.parseColor(input);
    }
    else if (typeof input === 'string') {
      const obj = stringToObject(input);
      this.parseColor(obj);
    }
    else {
      return this.initialValue;
    }
  }

  parseColor(input) {
    // console.log({ input });
    // input = isObject(input) ? input : stringToObject(input);
    // console.log({ input });
    const colorSpace = Object.keys(input).join('');
    if (colorSpace === 'rgb' || colorSpace === 'rgba') {
      this.convertFromRgb(input);
    }
    else if (colorSpace === 'hsl' || colorSpace === 'hsla') {
      this.convertFromHsl(input);
    }
    else {
      throw new Error('Unrecognized color space: ' + colorSpace);
    }
  }

  convertFromHex(string) {
    const hex = validateHex(string);
    const rgb = parseRGB(toString(convert.hex2rgb(hex)));
    const hsl = parseHSL(toString(convert.hex2hsl(hex)));
    this.hex = hex;
    this.rgb = rgb;
    this.hsl = hsl;
  }

  convertFromRgb(input) {
    const rgb = parseRGB(toString(input));
    const hsl = parseHSL(toString(convert.rgb2hsl(rgb.object())));
    const hex = convert.rgb2hex(rgb.object());
    this.hex = hex;
    this.rgb = rgb;
    this.hsl = hsl;
  }

  convertFromHsl(input) {
    const hsl = parseHSL(toString(input));
    const rgb = parseRGB(toString(convert.hsl2rgb(hsl.object())));
    const hex = convert.hsl2hex(hsl.object());
    this.hex = hex;
    this.rgb = rgb;
    this.hsl = hsl;
  }

  luminance(rgb) {
    rgb = rgb || this.rgb.array();
    const a = rgb.map((v) => {
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

  hue(amount, clone, set) {
    let { h, s, l, a } = this.hsl.object();
    h = set ? amount : h + amount;
    if (clone || set) {
      return new Color({ h, s, l, a });
    }
    this.convertFromHsl({ h, s, l, a });
    return this;
  }

  saturation(amount, clone, set) {
    let { h, s, l, a } = this.hsl.object();
    s = set ? amount : s + amount;
    if (clone || set) {
      return new Color({ h, s, l, a });
    }
    this.convertFromHsl({ h, s, l, a });
    return this;
  }

  lightness(amount, clone, set) {
    let { h, s, l, a } = this.hsl.object();
    l = set ? amount : l + amount;
    if (clone || set) {
      return new Color({ h, s, l, a });
    }
    this.convertFromHsl({ h, s, l, a });
    return this;
  }

  red(amount, clone, set) {
    let { r, g, b, a } = this.rgb.object();
    r = set ? amount : r + amount;
    if (clone || set) {
      return new Color({ r, g, b, a });
    }
    this.convertFromRgb({ r, g, b, a });
    return this;
  }

  green(amount, clone, set) {
    let { r, g, b, a } = this.rgb.object();
    g = set ? amount : g + amount;
    if (clone || set) {
      return new Color({ r, g, b, a });
    }
    this.convertFromRgb({ r, g, b, a });
    return this;
  }

  blue(amount, clone, set) {
    let { r, g, b, a } = this.rgb.object();
    b = set ? amount : b + amount;
    if (clone || set) {
      return new Color({ r, g, b, a });
    }
    this.convertFromRgb({ r, g, b, a });
    return this;
  }

  shades(dataType, step = 0.5, limit, colorSpace = 'hex') {
    const shades = [];
    let { h, s, l, a } = this.hsl.object();
    while (l > 0) {
      l = toFloat(l - step);
      const shade = new Color({ h, s, l, a });
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

  compare(color) {
    if (!color) {
      throw new Error(`
        compare requires at least 1 argument [the color to compare against]
        Example: new Color('red').compare('blue')
      `);
    }
    const ratio = this.contrast(color);
    let result;
    if (ratio < 3) {
      result = `${REDX}  contrast ratio:  ${ratio}`;
    }
    else if (ratio >= 3 && ratio < 4.5) {
      result = `${WARNING}  contrast ratio:  ${ratio}`;
    }
    else if (ratio >= 4.5 && ratio < 7) {
      result = `${OK}  contrast ratio:  ${ratio}`;
    }
    else if (ratio >= 7) {
      result = `${CHECKMARK}  contrast ratio:  ${ratio}`;
    }
    // eslint-disable-next-line no-console
    console.log(result);
  }
}

// console.log(Color.random('hsla'));
// console.log(Color.random('rgba'));
// console.log(Color.random('hsl'));
// console.log(Color.random('rgb'));
// console.log(Color.random());

// console.log(color.hsl.array());

// console.log(color.rgb.random(true));

// const hsl = color.hsl.css();
// const blue = color.set.blue(255).set.red(-255);
// console.log(hsl, color.hsl.css(), blue.hsl.css());
