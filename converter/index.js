import { toFloat } from '../utils/index.js';
import { removeHash } from '../lib/hex.js';

class Converter {
  hex2rgb(str) {
    str = removeHash(str);
    const r = parseInt(str.substring(0, 2), 16);
    const g = parseInt(str.substring(2, 4), 16);
    const b = parseInt(str.substring(4, 6), 16);
    const a = toFloat(parseInt(str.substring(6, 8), 16) / 255);

    return isNaN(a) ? { r, g, b } : { r, g, b, a };
  }

  rgb2hsl({ r, g, b, a }) {
    const [ R, G, B ] = [ r, g, b ].map((n) => (n /= 255));
    const max = Math.max(R, G, B);
    const min = Math.min(R, G, B);

    let h;
    let s;
    let l = (max + min) / 2;

    if (max === min) {
      h = 0;
      s = 0;
    }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case R:
          h = (G - B) / d + (G < B ? 6 : 0);
          break;
        case G:
          h = (B - R) / d + 2;
          break;
        case B:
          h = (R - G) / d + 4;
          break;
      }
    }

    h /= 6.0;

    h = Math.round(toFloat(h * 360));
    s = Math.round(toFloat(s * 100));
    l = Math.round(toFloat(l * 100));

    return a ? { h, s, l, a } : { h, s, l };
  }

  hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  hsl2rgb({ h, s, l, a }) {
    let r, g, b;
    [ h, s, l ] = [ h, s, l ].map((n, i) => (i === 0 ? n / 360 : n / 100));

    if (s === 0) {
      r = g = b = l;
    }
    else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;

      const p = 2 * l - q;

      r = this.hue2rgb(p, q, h + 1 / 3);
      g = this.hue2rgb(p, q, h);
      b = this.hue2rgb(p, q, h - 1 / 3);
    }

    r = Math.max(0, Math.min(Math.round(r * 255), 255));
    g = Math.max(0, Math.min(Math.round(g * 255), 255));
    b = Math.max(0, Math.min(Math.round(b * 255), 255));

    return a ? { r, g, b, a } : { r, g, b };
  }

  rgb2hex({ r, g, b, a }) {
    const rgb = [ r, g, b ].map((val) => val.toString(16));
    const [ h, e, x ] = rgb.map(
      (char) => (char = char.length === 1 ? '0' + char : char)
    );

    if (a !== undefined) {
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      a = Math.round(a * 255).toString(16);
      a = a.length === 1 ? '0' + a : a;
      return `#${h}${e}${x}${a}`;
    }
    return `#${h}${e}${x}`;
  }

  hsl2hex({ h, s, l, a }) {
    const { r, g, b } = this.hsl2rgb({ h, s, l, a });
    const hex = this.rgb2hex({ r, g, b, a });
    return hex;
  }

  hex2hsl(str) {
    const { r, g, b, a } = this.hex2rgb(str);
    const hsl = this.rgb2hsl({ r, g, b, a });
    return hsl;
  }
}

export default new Converter();
