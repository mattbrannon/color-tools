export type PreferedColorSpace = 'rgb' | 'hsl' | 'hex';
export type PreferedDataType = 'array' | 'object' | 'css';

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

export interface RgbHex {
  r: number | string;
  g: number | string;
  b: number | string;
}

export interface ColorMethods {
  array(): any;
  object(): any;
  css(): any;
}

export interface ColorInterface {
  hex: ColorMethods;
  rgb: ColorMethods;
  hsl: ColorMethods;
}

export interface ThemeInterface extends ColorInterface {
  analagous(colorSpace: string): {};
  triadic(colorSpace: string): {};
  compound(colorSpace: string): {};
  tetradic(colorSpace: string): {};
}

export interface ColorGenerator {
  limit?: number;
  step?: number;
}

export type Limit = number;
export type Step = number;
