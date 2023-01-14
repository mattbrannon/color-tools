import { toFloat, removeHash } from './utils';
import { makeLong } from './hex';

export const hexToRgb = (str: string) => {
  str = removeHash(makeLong(str));
  const r = parseInt(str.substring(0, 2), 16);
  const g = parseInt(str.substring(2, 4), 16);
  const b = parseInt(str.substring(4, 6), 16);
  const a = toFloat(parseInt(str.substring(6, 8), 16) / 255);

  return isNaN(a) ? [ r, g, b ] : [ r, g, b, a ];
};

export const rgbToHsv = (rgb: number[]) => {
  // const [ R, G, B ] = [ r, g, b ].map((n) => (n /= 255));
  const [ r, g, b ] = rgb.map((n) => (n /= 255));
  const a = rgb[3];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h: number = 0;
  let s: number = 0;
  let v = max;

  if (max !== min) {
    const d = max - min;
    s = max === 0 ? 0 : d / max;
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
  v = Math.round(toFloat(v * 100));

  return a ? [ h, s, v, a ] : [ h, s, v ];
};

export const rgbToHsl = (rgb: number[]): number[] => {
  const [ r, g, b, a ] = rgb.map((n, i) => {
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

  return a ? [ h, s, l, a ] : [ h, s, l ];
};

export const hue2rgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

export const hslToRgb = (hsl: number[]) => {
  let r: number;
  let g: number;
  let b: number;

  const [ h, s, l, a ] = hsl.map((n, i) => {
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

  return a ? [ r, g, b, a ] : [ r, g, b ];
};

export const hsvToRgb = (hsv: number[]) => {
  let r: number = 0;
  let g: number = 0;
  let b: number = 0;
  const [ h, s, v, a ] = hsv.map((n, i) => {
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
  return a ? [ r, g, b, a ] : [ r, g, b ];
};

export const rgbToHex = (rgb: number[]) => {
  const [ r, g, b ] = rgb
    .map((val) => val.toString(16))
    .map((s) => s.padStart(2, '0'));
  const alpha = rgb[3];

  if (alpha) {
    const a = Math.round(Math.min(Math.max(0, alpha), 1) * 255).toString(16);
    return `#${r}${g}${b}${a}`;
  }
  return `#${r}${g}${b}`;
};

export const hslToHex = (hsl: number[]) => {
  const rgb = hslToRgb(hsl);
  const hex = rgbToHex(rgb);
  return hex;
};

export const hexToHsl = (str: string) => {
  const rgb = hexToRgb(str);
  const hsl = rgbToHsl(rgb);
  return hsl;
};

export const hexToHsv = (str: string) => {
  const rgb = hexToRgb(str);
  const hsv = rgbToHsv(rgb);
  return hsv;
};

export const hsvToHex = (hsv: number[]) => {
  const rgb = hsvToRgb(hsv);
  const hex = rgbToHex(rgb);
  return hex;
};

export const hslToHsv = (hsl: number[]) => {
  const rgb = hslToRgb(hsl);
  const hsv = rgbToHsv(rgb);
  return hsv;
};

export const hsvToHsl = (hsv: number[]) => {
  const rgb = hsvToRgb(hsv);
  const hsl = rgbToHsl(rgb);
  return hsl;
};

const rgbToHwb = (rgb: number[]) => {
  const [ red, green, blue ] = rgb;
  const [hue] = convert.rgbToHsl(rgb);
  const white = toFloat((1 / 255) * Math.min(red, Math.min(green, blue)) * 100);
  const black = toFloat(
    1 - (1 / 255) * Math.max(red, Math.max(green, blue)) * 100
  );
  return [ hue, white, black ];
};

function hwbToRgb(hwb: number[]) {
  const white = hwb[1] / 100;
  const black = hwb[2] / 100;
  if (white + black >= 1) {
    const gray = white / (white + black);
    return [ gray, gray, gray ];
  }
  const rgb = hslToRgb([ hwb[0], 100, 50 ]);
  for (let i = 0; i < 3; i++) {
    rgb[i] *= 1 - white - black;
    rgb[i] += white;
  }
  return rgb;
}

function rgbToCmyk(rgb: number[]) {
  const [ r, g, b ] = rgb.map((n) => n / 255);
  const k = 1 - Math.max(r, g, b);
  const [ c, m, y ] = [ r, g, b ].map((n) =>
    Math.round(((1 - n - k) / (1 - k)) * 100)
  );
  return [ c, m, y, Math.round(k * 100) ];
}

function hexToCmyk(hex: string) {
  const rgb = hexToRgb(hex);
  const cmyk = rgbToCmyk(rgb);
  return cmyk;
}

function hslToCmyk(hsl: number[]) {
  const rgb = hslToRgb(hsl);
  const cmyk = rgbToCmyk(rgb);
  return cmyk;
}

function hsvToCmyk(hsv: number[]) {
  const rgb = hsvToRgb(hsv);
  const cmyk = rgbToCmyk(rgb);
  return cmyk;
}

function cmykToRgb(cmyk: number[]) {
  const k = Number(cmyk.slice(-1));
  return cmyk
    .map((n) => {
      return Math.round(255 * (1 - ((n / 100) * (1 - k / 100) + k / 100)));
    })
    .slice(0, 3);
}

function cmykToHex(cmyk: number[]) {
  const rgb = cmykToRgb(cmyk);
  const hex = rgbToHex(rgb);
  return hex;
}

function cmykToHsl(cmyk: number[]) {
  const rgb = cmykToRgb(cmyk);
  const hsl = rgbToHsl(rgb);
  return hsl;
}
function cmykToHsv(cmyk: number[]) {
  const rgb = cmykToRgb(cmyk);
  const hsv = rgbToHsv(rgb);
  return hsv;
}

export const convert = {
  hexToHsl,
  hexToHsv,
  hexToRgb,
  hexToCmyk,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  hslToHex,
  hslToRgb,
  hslToHsv,
  hslToCmyk,
  hsvToHex,
  hsvToHsl,
  hsvToRgb,
  hsvToCmyk,
  cmykToHex,
  cmykToHsl,
  cmykToHsv,
  cmykToRgb,
  rgbToHwb,
  hwbToRgb,
};
