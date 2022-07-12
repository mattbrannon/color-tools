//@ts-ignore
import { Color } from './color.js'
import { toFloat } from './utils.js';
import { keepHueInRange } from './hsl.js';
import { ThemeObject } from './interfaces.js';

export class Theme extends Color {
  theme: ThemeObject
  initialValue: any
  private _hsl: any;
  private _rgb: any;
  private _hex: any;

  constructor(initialValue:any) {
    super(initialValue);
    this.theme = {};
    this._hsl.get = () => this.get('hsl');
    this._rgb.get = () => this.get('rgb');
    this._hex.get = () => this.get('hex');
  }

  get(colorSpace: string) {
    const { theme: { left, right, middle } } = this;
    //@ts-ignore
    const colors = [this[colorSpace].css()];
    const obj = { left, right, middle };
    for (const key in obj) {
      //@ts-ignore
      if (obj[key]) {
        //@ts-ignore
        const color = obj[key][colorSpace].css();
        colors.push(color);
      }
    }

    return colors;
  }

  rotate(amount: any) {
    const { h } = this._hsl.object();
    return toFloat(keepHueInRange(h + amount));
  }

  create(amount: number) {
    let { h, s, l, a } = this._hsl.object();
    h = this.rotate(amount);
    return new Color({ h, s, l, a });
  }

  complement() {
    this.theme.middle = this.create(180);
    return this;
  }

  analagous() {
    this.theme.left = this.create(-30);
    this.theme.right = this.create(30);
    return this;
  }

  triadic() {
    this.theme.left = this.create(-120);
    this.theme.right = this.create(120);
    return this;
  }

  compound() {
    this.theme.left = this.create(150);
    this.theme.right = this.create(210);
    return this;
  }

  tetradic() {
    this.theme.left = this.create(300);
    this.theme.right = this.create(120);
    this.theme.middle = this.create(180);
    return this;
  }
}
