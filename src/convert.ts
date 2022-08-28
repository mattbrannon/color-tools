import { RgbObject, HslObject, HsvColor } from './interfaces';
import { toFloat, removeHash } from './utils';
import { makeLong } from './hex-new';

export const hexToRgb = (str: string) => {
  str = removeHash(makeLong(str));
  const r = parseInt(str.substring(0, 2), 16);
  const g = parseInt(str.substring(2, 4), 16);
  const b = parseInt(str.substring(4, 6), 16);
  const a = toFloat(parseInt(str.substring(6, 8), 16) / 255);

  return isNaN(a) ? { r, g, b } : { r, g, b, a };
};

export const rgbToHsv = ({ r, g, b, a }: RgbObject) => {
  const [ R, G, B ] = [ r, g, b ].map((n) => (n /= 255));
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);

  let h: number = 0;
  let s: number = 0;
  let v = max;

  if (max !== min) {
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    switch (max) {
      case R: {
        h = (G - B) / d + (G < B ? 6 : 0);
        break;
      }
      case G: {
        h = (B - R) / d + 2;
        break;
      }
      case B: {
        h = (R - G) / d + 4;
        break;
      }
    }
  }

  h /= 6.0;

  h = Math.round(toFloat(h * 360));
  s = Math.round(toFloat(s * 100));
  v = Math.round(toFloat(v * 100));

  return a ? { h, s, v, a } : { h, s, v };
};

export const rgbToHsl = (rgb: RgbObject): HslObject => {
  const [ r, g, b, a ] = Object.values(rgb).map((n, i) => {
    const value = i < 3 ? n / 255 : n;
    return value;
  });
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: {
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      }
      case g: {
        h = (b - r) / d + 2;
        break;
      }
      case b: {
        h = (r - g) / d + 4;
        break;
      }
    }
  }

  h /= 6.0;

  h = Math.round(toFloat(h * 360));
  s = Math.round(toFloat(s * 100));
  l = Math.round(toFloat(l * 100));

  return a ? ({ h, s, l, a } as HslObject) : ({ h, s, l } as HslObject);
};

export const hue2rgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

export const hslToRgb = (hsl: HslObject) => {
  let r, g, b;
  const [ h, s, l, a ] = Object.values(hsl).map((n, i) => {
    const value = i === 0 ? n / 360 : i < 3 ? n / 100 : n;
    return value;
  });

  if (s === 0) {
    r = g = b = l;
  }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;

    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  r = Math.max(0, Math.min(Math.round(r * 255), 255));
  g = Math.max(0, Math.min(Math.round(g * 255), 255));
  b = Math.max(0, Math.min(Math.round(b * 255), 255));

  return a ? { r, g, b, a } : { r, g, b };
};

export const hsvToRgb = (hsv: HsvColor) => {
  let r: number = 0;
  let g: number = 0;
  let b: number = 0;
  const [ h, s, v, a ] = Object.values(hsv).map((n, i) => {
    const value = i === 0 ? n / 360 : i < 3 ? n / 100 : n;
    return value;
  });

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: {
      (r = v), (g = t), (b = p);
      break;
    }
    case 1: {
      (r = q), (g = v), (b = p);
      break;
    }
    case 2: {
      (r = p), (g = v), (b = t);
      break;
    }
    case 3: {
      (r = p), (g = q), (b = v);
      break;
    }
    case 4: {
      (r = t), (g = p), (b = v);
      break;
    }
    case 5: {
      (r = v), (g = p), (b = q);
      break;
    }
  }

  r = Math.max(0, Math.min(Math.round(r * 255), 255));
  g = Math.max(0, Math.min(Math.round(g * 255), 255));
  b = Math.max(0, Math.min(Math.round(b * 255), 255));
  return a ? { r, g, b, a } : { r, g, b };
};

export const rgbToHex = (rgb: RgbObject) => {
  const [ r, g, b ] = Object.values(rgb)
    .map((val) => val.toString(16))
    .map((s) => s.padStart(2, '0'));

  const alpha =
    Object.values(rgb).length === 4
      ? Number(Object.values(rgb).slice(-1).join(''))
      : null;
  if (alpha) {
    const a = Math.round(Math.min(Math.max(0, alpha), 1) * 255).toString(16);
    return `#${r}${g}${b}${a}`;
  }
  return `#${r}${g}${b}`;

  // const [ h, e, x ] = rgb.map((char) => {
  //   const value = char.length === 1 ? '0' + char : char;
  //   return value;
  // });

  // if (a !== undefined) {
  //   // a = a < 0 ? 0 : a > 1 ? 1 : a;
  //   // const alpha = Math.min(Math.max(0, n), 100);
  //   const alpha = Math.round(Math.min(Math.max(0, a), 1) * 255)
  //     .toString(16)
  //     .padStart(2, '0');
  //   // let alpha: any = Math.round(Math.min(Math.max(0, a), 1) * 255).toString(16);
  //   // alpha = alpha.length === 1 ? '0' + alpha : alpha;
  //   return `#${r}${g}${b}${alpha}`;
  // }
  // return `#${r}${g}${b}`;
};

export const hslToHex = (hsl: HslObject) => {
  const rgb = hslToRgb(hsl);
  const hex = rgbToHex(rgb as RgbObject);
  return hex;
};

export const hexToHsl = (str: string) => {
  const rgb = hexToRgb(str);
  const hsl = rgbToHsl(rgb as RgbObject);
  return hsl;
};

export const hexToHsv = (str: string) => {
  const rgb = hexToRgb(str);
  const hsv = rgbToHsv(rgb as RgbObject);
  return hsv;
};

export const hsvToHex = (hsv: HsvColor) => {
  const rgb = hsvToRgb(hsv);
  const hex = rgbToHex(rgb as RgbObject);
  return hex;
};

export const hslToHsv = (hsl: HslObject) => {
  const rgb = hslToRgb(hsl);
  const hsv = rgbToHsv(rgb as RgbObject);
  return hsv;
};

export const hsvToHsl = (hsv: HsvColor) => {
  const rgb = hsvToRgb(hsv);
  const hsl = rgbToHsl(rgb as RgbObject);
  return hsl;
};

export const convert = {
  hexToHsl,
  hexToHsv,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  hslToHex,
  hslToRgb,
  hslToHsv,
  hsvToHex,
  hsvToHsl,
  hsvToRgb,
};
