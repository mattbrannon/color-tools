export type PreferedColorSpace = 'rgb' | 'hsl' | 'hex';
export type PreferedDataType = 'array' | 'object' | 'css';

export interface Config {
  dataType: PreferedDataType;
  colorSpace: PreferedColorSpace;
  consistentTheme?: boolean;
}

export type ColorObject = { [key: string]: string | number };
export type ColorArray = (string | number)[];

export type ColorInput = ColorObject | ColorArray | string;

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
  rectangle(colorSpace: string): {};
  complementary(colorSpace: string): {};
}
