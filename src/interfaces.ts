export interface RgbColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HslColor {
  h?: number;
  s?: number;
  l?: number;
  a?: number;
}

export interface HsvColor {
  h: number;
  s: number;
  v: number;
  a?: number;
}

export interface ColorMethods {
  array: any[];
  object: RgbColor | HslColor;
  css: string;
}

interface RGB {
  array: any[];
  object: {};
  css: string;
}

interface HSL {
  array: number[];
  object: {};
  css: string;
}

interface HEX {
  hex: string;
  alpha: string;
}

export interface ColorObject {
  rgb: RGB;
  hsl: HSL;
  hex: HEX;
}

export interface ThemeObject {
  left?: any;
  right?: any;
  middle?: any;
}
