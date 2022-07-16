import { Color } from './color';
import { ThemeInterface } from './interfaces';
import { parseColor } from './color-parsers';

export class Theme extends Color implements ThemeInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor(args) {
    super(args);
  }

  #rotate(amount: number) {
    const { h } = this.hsl.object();
    return h + amount;
  }

  #create(amount: number) {
    let { h, s, l, a } = this.hsl.object();
    h = this.#rotate(amount);
    return parseColor({ h, s, l, a });
  }

  #createColor(n: number) {
    return this.#create(n)[this.colorSpace][this.dataType]();
  }

  #getCurrent() {
    return this[this.colorSpace][this.dataType]();
  }

  analagous() {
    const left = this.#createColor(-30);
    const right = this.#createColor(30);
    const middle = this.#getCurrent();
    return [ left, middle, right ];
  }

  triadic() {
    const left = this.#createColor(-120);
    const right = this.#createColor(120);
    const middle = this.#getCurrent();
    return [ left, middle, right ];
  }

  compound() {
    const left = this.#createColor(150);
    const right = this.#createColor(210);
    const middle = this.#getCurrent();
    return [ left, middle, right ];
  }

  tetradic() {
    const left = this.#createColor(300);
    const right = this.#createColor(120);
    const middle = this.#createColor(180);
    const current = this.#getCurrent();
    return [ left, middle, current, right ];
  }
}
