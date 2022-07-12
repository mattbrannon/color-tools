export interface RgbColor {
  r: number,
  g: number,
  b: number,
  a?: number
}

export interface HslColor {
  h: number,
  s: number,
  l: number,
  a?: number
}

export interface HsvColor {
  h: number,
  s: number,
  v: number,
  a?: number
}

export interface ThemeObject {
  left?: any,
  right?: any,
  middle?: any
}