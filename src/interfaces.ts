export type PreferedColorSpace = 'rgb' | 'hsl' | 'hex';
export type PreferedDataType = 'array' | 'object' | 'css';

export interface Config {
  dataType: any;
  colorSpace: any;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
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

export type InputArray = [any, any, any, any?];
export type ColorArray = [number, number, number, number?];

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type Range<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

export type RgbValues = Range<0, 256>;
export type HueValues = Range<0, 361>;
export type PercentValues = Range<0, 101>;
export type AlphaValues = Range<0, 2>;

export type RgbArrayValues = [RgbValues, RgbValues, RgbValues, AlphaValues?];
export type HslArray = [HueValues, PercentValues, PercentValues, AlphaValues?];

export type HslObject = {
  h: HueValues;
  s: PercentValues;
  l: PercentValues;
  a?: AlphaValues;
};

// export enum HslValues {
//   hue = 0 | 360,
//   saturation = 0 || 100,
//   lightness = 0 || 100,
// }

// type RGBColor = number & { _type_: 'RGBColor' };
// type Hue = number & { _type_: 'Hue' };

// export const validateHue = (value: number): HueValues => {
//   if (value < 0 || value > 255) {
//     throw new Error(`The value ${value} is not a valid color`);
//   }

//   return value as HueValues;
// };
