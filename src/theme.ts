/* eslint-disable no-unused-vars */
import { Color } from './color';
import { ThemeInterface } from './interfaces';
import { makeRangeOfSteps } from './utils';

type ColorInput = string | Color;

const getOrCreateInstance = (color: ColorInput) => {
  color = color instanceof Color ? color : new Color(color);
  return color;
};

const createRangeOfColors = (
  color1: ColorInput,
  color2: ColorInput,
  steps = 10
) => {
  color1 = getOrCreateInstance(color1);
  color2 = getOrCreateInstance(color2);

  const makeRange = makeRangeOfSteps(steps);
  const makeHueRange = makeRange(true);
  const makeLinearRange = makeRange();
  const arr2 = color2.hsl.array();

  const arr = color1.hsl.array().map((val: number, i: number) => {
    const n = arr2[i];
    return i === 0 ? makeHueRange(val, n) : makeLinearRange(val, n);
  });

  const values = Array.from({ length: steps }, (_, i) => {
    const h = arr[0][i];
    const s = arr[1][i];
    const l = arr[2][i];
    const color = new Color({ h, s, l }).rgb.css();
    return color;
  });
  return values;
};

const createShadowValues = (
  start: ColorInput,
  end: ColorInput,
  steps: number | undefined
) => {
  const input1 = new Color(start);
  const input2 = new Color(end);
  const colors = createRangeOfColors(input1, input2, steps);

  const shadow = colors.map((value, i) => {
    const blur = i * 0.0125;
    const x = i * 0.011 * -1;
    const textShadow = `${x / 1.1}em ${x / 1.1}em ${
      blur * 0.1
    }em ${value}`;
    const boxShadow = `${x / 1.1}em ${x / 1.1}em ${x}em ${
      blur * 0.1
    }em ${value}`;

    return [ textShadow, boxShadow ];
  });

  const [ textShadow, boxShadow ] = shadow;
  return {
    text: textShadow,
    box: boxShadow,
  };
};

// @ts-ignore
const createFullStopGradient = (values: any[]) => {
  return values
    .map((color, i) => {
      const start = (i / values.length) * 100;
      const stop = ((i + 1) / values.length) * 100;
      return `${color} ${start}%, ${color} ${stop}%`;
    })
    .join(', ');
};

// @ts-ignore
const buildGradientString = (values: any[], offset = 0) => {
  const stepBy = 100 / (values.length - 1);
  return values
    .map((color, i) => {
      const n = i * stepBy + offset;
      return `${color} ${n}%`;
    })
    .join(', ');
};

const createGradientValues = (
  color1: ColorInput,
  color2: ColorInput,
  steps: number
) => {
  const colors = createRangeOfColors(color1, color2, steps);
  return {
    linear(isRepeating: boolean) {
      const type = isRepeating
        ? 'repeating-linear-gradient'
        : 'linear-gradient';
      return `${type}(${colors.join(',')})`;
    },
    radial(isRepeating: boolean) {
      const type = isRepeating
        ? 'repeating-radial-gradient'
        : 'radial-gradient';
      return `${type}(${colors.join(', ')})`;
    },
    conic(isRepeating: boolean | undefined) {
      const type = isRepeating
        ? 'repeating-conic-gradient'
        : 'conic-gradient';
      return `${type}(${colors.join(', ')})`;
    },
    values() {
      return colors;
    },
  };
};

export class Theme extends Color implements ThemeInterface {
  gradients: {};
  shadows: {};
  theme: {};
  constructor(args: string | {}) {
    super(args);
    this.gradients = {};
    this.shadows = {};
    this.theme = {
      complementary: this.complementary(),
      splitComplementary: this.splitComplementary(),
      analagous: this.analagous(),
      triadic: this.triadic(),
      tetradic: this.tetradic(),
      compound: this.compound(),
      rectangle: this.rectangle(),
      square: this.square(),
    };
  }

  #rotate(amount: number) {
    const { h } = this.hsl.object();
    return h + amount;
  }

  #create(amount: number) {
    // let { h, s, l, a } = this.hsl.object();
    let { h } = this.hsl.object();
    const random = new Color(Color.random()).hsl.array();
    const [ s, l, a ] = random.slice(1);
    h = this.#rotate(amount);
    return new Color({ h, s, l, a });
  }

  #createColor(n: number) {
    return this.#create(n)?.[this.colorSpace][this.dataType]();
  }

  #getCurrent() {
    return this[this.colorSpace][this.dataType]();
  }

  gradient(stop: ColorInput, steps = 5) {
    const start = this.#getCurrent();
    const gradients = createGradientValues(start, stop, steps);
    return gradients;
  }

  shadow(stop: ColorInput, steps = 5) {
    const start = this.#getCurrent();
    const shadows = createShadowValues(start, stop, steps);
    return shadows;
  }

  complementary() {
    return [ this.#getCurrent(), this.#createColor(180) ];
  }

  splitComplementary() {
    return [
      this.#createColor(-150),
      this.#getCurrent(),
      this.#createColor(150),
    ];
  }

  analagous() {
    return [
      this.#createColor(-30),
      this.#getCurrent(),
      this.#createColor(30),
    ];
  }

  triadic() {
    return [
      this.#createColor(-120),
      this.#getCurrent(),
      this.#createColor(120),
    ];
  }

  // apparently same as split complementary
  compound() {
    return [
      this.#createColor(150),
      this.#getCurrent(),
      this.#createColor(210),
    ];
  }

  tetradic() {
    return [
      this.#getCurrent(),
      this.#createColor(120),
      this.#createColor(180),
      this.#createColor(300),
    ];
  }

  rectangle() {
    return [
      this.#getCurrent(),
      this.#createColor(30),
      this.#createColor(180),
      this.#createColor(210),
    ];
  }

  square() {
    return [
      this.#getCurrent(),
      this.#createColor(90),
      this.#createColor(180),
      this.#createColor(270),
    ];
  }
}
