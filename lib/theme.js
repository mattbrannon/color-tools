import { Color } from './color.js';
import { toFloat } from './utils.js';
import { keepHueInRange } from './hsl.js';

export class Theme extends Color {
  constructor(initialValue) {
    super(initialValue);
    this.theme = {};
    this._hsl.get = () => this.get('hsl');
    this._rgb.get = () => this.get('rgb');
    this._hex.get = () => this.get('hex');
  }

  get(colorSpace) {
    const {
      theme: { left, right, middle },
    } = this;
    const colors = [this[colorSpace].css()];
    const obj = { left, right, middle };
    for (const key in obj) {
      if (obj[key]) {
        const color = obj[key][colorSpace].css();
        colors.push(color);
      }
    }

    return colors;
  }

  rotate(amount) {
    const { h } = this.hsl.object();
    return toFloat(keepHueInRange(h + amount));
  }

  create(amount) {
    let { h, s, l, a } = this.hsl.object();
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
