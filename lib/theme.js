import Color from './color.js';
import { toFloat } from './utils.js';
import { keepHueInRange } from './hsl.js';

export default class Theme extends Color {
  constructor(initialValue) {
    super(initialValue);
    this.theme = {};
    this._hsl.get = () => this.get('hsl');
    this._rgb.get = () => this.get('rgb');
    this._hex.get = () => this.get('hex');
  }

  get(colorSpace) {
    const {
      theme: { left, right, complement },
    } = this;
    const colors = [this[colorSpace].css()];
    const obj = { left, right, complement };
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
    this.theme.complement = this.create(180);
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
    this.theme.complement = this.create(180);
    return this;
  }
}

// const theme = new Theme('blue').tetradic();
// console.log(theme.get('hsl'));

// function getShadow(color, step, limit) {
//   return new Color(color).hsl.shades(step, limit).map((value, i) => {
//     return new Color(value).saturation((i + 1) * -step).hsl.css();
//   });
// }

// const shadow = getShadow('blue', 5, 10);
// console.log(shadow);

// function getGradient(color, step, limit) {
//   return new Color(color).hsl.tints(step, limit).map((value, i) => {
//     // console.log(value);
//   });
// }

// const shadow = getGradient('hsl(210 100% 25%)', 5, 10);

// console.log(shadow);

// const color = new Theme('red');
// console.log(color);

// console.log(shades);
// const all = [ color.hsl.css(), ...shades ];

// console.log(all);

// function getShadow(color, step, limit) {
//   return new Color(color).hsl.shades(step, limit).map((value, i) => {
//     return new Color(value).saturation((i + 1) * -step).hsl.css();
//   });
// }

// const shadow = getShadow('hsl(210 80% 85%)', 5, 10);

// console.log(shadow);

// console.log(shades);
// const all = [ color.hsl.css(), ...shades ];

// console.log(all);

// let hue = 60;
// let light = 40;
// let step = 6;
// for (let i = 0; i < step; i++) {
//   console.log(`hsl(${hue}, 100%, ${light}%),`);
//   hue += step;
//   light += 5;
// }

// hsl(30, 100%, 40%),
// hsl(36, 100%, 45%),
// hsl(42, 100%, 50%),
// hsl(48, 100%, 55%),
// hsl(54, 100%, 60%),
// hsl(60, 100%, 65%)
