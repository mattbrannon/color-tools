import convert from './converter/index.js';
import { validateHex } from './lib/hex.js';
import { parseHSL } from './lib/hsl.js';
import { parseRGB } from './lib/rgb.js';
import { isValidHex, isObject, toObject, toString, toFloat, isNamedColor } from './utils/index.js';
import { REDX, WARNING, OK, CHECKMARK } from './constants/unicodes.js';

export default class Color {
  constructor(initialValue) {
    this.initialValue = initialValue;
    this.init(initialValue);
  }

  static random() {
    return `#${Math.random()
      .toString(16)
      .substr(2, 6)}`;
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

  init(input) {
    if (isValidHex(input)) {
      this.convertFromHex(input);
    }
    else if (isNamedColor(input)) {
      this.convertFromHex(isNamedColor(input));
    }
    else {
      this.parseColor(input);
    }
  }

  parseColor(input) {
    input = isObject(input) ? input : toObject(input);
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

    this.rgb = {
      css: () => rgb.css(),
      object: () => rgb.object(),
      array: () => rgb.array(),
    };

    this.hsl = {
      css: () => hsl.css(),
      object: () => hsl.object(),
      array: () => hsl.array(),
    };

    Object.freeze(this);
  }

  convertFromRgb(input) {
    const rgb = parseRGB(toString(input));
    const hsl = parseHSL(toString(convert.rgb2hsl(rgb.object())));
    const hex = convert.rgb2hex(rgb.object());

    this.rgb = {
      css: () => rgb.css(),
      object: () => rgb.object(),
      array: () => rgb.array(),
    };

    this.hsl = {
      css: () => hsl.css(),
      object: () => hsl.object(),
      array: () => hsl.array(),
    };

    this.hex = hex;
    Object.freeze(this);
  }

  convertFromHsl(input) {
    const hsl = parseHSL(toString(input));
    const rgb = parseRGB(toString(convert.hsl2rgb(hsl.object())));
    const hex = convert.hsl2hex(hsl.object());

    this.hex = hex;

    this.rgb = {
      css: () => rgb.css(),
      object: () => rgb.object(),
      array: () => rgb.array(),
    };

    this.hsl = {
      css: () => hsl.css(),
      object: () => hsl.object(),
      array: () => hsl.array(),
    };

    Object.freeze(this);
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

  shades(l = 100, type = 'hex', step = 0.1) {
    const shades = [];
    const { h, s } = this.hsl.object();
    while (l >= 0) {
      const shade = new Color({ h, s, l });
      type === 'hex' ? shades.push(shade.hex) : shades.push(shade[type].css());
      l = toFloat(l - step);
    }
    return [ ...new Set(shades) ];
  }

  tints(l = 0, type = 'hex', step = 0.1) {
    const tints = [];
    const { h, s } = this.hsl.object();
    while (l <= 100) {
      const tint = new Color({ h, s, l });
      type === 'hex' ? tints.push(tint.hex) : tints.push(tint[type].css());
      l = toFloat(l + step);
    }
    return [ ...new Set(tints) ];
  }

  chromas(type = 'hex', step = 1) {
    const chromas = [];
    const { h, l } = this.hsl.object();
    let s = 100;
    while (s >= 0) {
      const chroma = new Color({ h, s, l });
      type === 'hex' ? chromas.push(chroma.hex) : chromas.push(chroma[type].css());
      s = toFloat(s - step);
    }
    return chromas;
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
    console.log(result);
  }
}
