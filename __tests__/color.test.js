const { Color } = require('../src/color');
const { isHex, getColorSpace } = require('../src/utils');

describe('Color class', () => {
  describe('constructor', () => {
    it('should accept a css string', () => {
      expect(() => new Color('red')).not.toThrow();
      expect(() => new Color('hsl(240deg, 100%, 50%')).not.toThrow();
      expect(() => new Color('rgb(201, 48, 55, 0.78')).not.toThrow();
      expect(() => new Color('#00ff00')).not.toThrow();
    });
    it('should error when given invalid input', () => {
      expect(() => new Color('wrong')).toThrow();
    });
  });

  describe('static methods', () => {
    describe('random', () => {
      it('should have a random method', () => {
        expect(Color.random).toBeDefined();
      });
      it('should return a valid hex string', () => {
        expect(isHex(Color.random())).toEqual(true);
      });
      it('should return a random hex string', () => {
        const hex1 = Color.random();
        const hex2 = Color.random();
        expect(hex1).not.toEqual(hex2);
      });
    });

    describe('contrast', () => {
      it('should exist', () => {
        expect(Color.contrast).toBeDefined;
      });
      it('should be a function', () => {
        expect(typeof Color.contrast).toEqual('function');
      });
      it('should return a number', () => {
        const ratio = Color.contrast('blue', 'green');
        expect(typeof ratio).toEqual('number');
      });
      it('should return the correct contrast ratio', () => {
        const ratio = Color.contrast('blue', 'green');
        expect(ratio).toEqual(1.67);
      });
      it('should accept an instance of Color', () => {
        const blue = new Color('blue');
        const green = new Color('green');
        const ratio = Color.contrast(blue, green);
        expect(ratio).toEqual(1.67);
      });
      it('should return an error message when given invalid input', () => {
        const error = Color.contrast('no-color');
        expect(error).toMatch('Unrecognized color');
        // expect(() => Color.contrast('no-color')).toThrow();
      });
    });
  });

  const methods = [ 'array', 'object', 'css' ];
  const properties = [ 'hex', 'rgb', 'hsl' ];

  const sharedMethods = [
    'red',
    'blue',
    'green',
    'hue',
    'saturation',
    'lightness',
  ];

  const generators = [ 'shades', 'tints', 'faded', 'vibrant' ];

  describe('properties', () => {
    const red = new Color('red');

    properties.forEach((property) => {
      describe(property, () => {
        it(`should have a ${property} property`, () => {
          expect(red[property]).toBeDefined();
        });
        describe(`${property} should have methods attached`, () => {
          methods.forEach((method) => {
            it(`${property} property should have a ${method} method`, () => {
              expect(red.hex[method]).toBeDefined();
            });
          });
        });
      });
    });
  });

  describe('shared methods', () => {
    const blue = new Color('blue');
    it('should have a value method', () => {
      expect(blue.value).toBeDefined();
      expect(blue.value()).toEqual('#0000FF');
    });
    describe('colorSpace', () => {
      const colorSpaces = [ 'rgb', 'hsl', 'hex' ];
      colorSpaces.forEach((colorSpace) => {
        it('should be in the preferred color space', () => {
          blue.colorSpace = colorSpace;
          const value = blue.value();
          expect(getColorSpace(value)).toEqual(colorSpace);
        });
      });
      it('should set a default based on user input', () => {
        const color = new Color({ r: 123, g: 43, b: 210 });
        const value = color.value();
        expect(getColorSpace(value)).toEqual('rgb');
      });
    });
    it('should be in the preferred data type', () => {
      blue.dataType = [];
      expect(Array.isArray(blue.value())).toEqual(true);
    });

    sharedMethods.forEach((method) => {
      describe(`${method} method`, () => {
        it(`should have a ${method} method on the instance`, () => {
          const color = new Color({ h: 240, s: 100, l: 50 });
          expect(color[method]).toBeDefined();
        });
        it(`${method} should exist on the prototype`, () => {
          expect(Color.prototype[method]).toBeDefined();
        });
        it('should create a new instance', () => {
          const color1 = new Color(Color.random());
          const color2 = color1[method](50);
          expect(color2).toBeInstanceOf(Color);
          expect(color1).not.toEqual(color2);
        });
      });
    });
  });
  describe('color generators', () => {
    generators.forEach((generator) => {
      describe(generator, () => {
        it(`should have a ${generator} method`, () => {
          const color = new Color(Color.random());
          expect(color[generator]).toBeDefined();
        });
        it('should return an array of values', () => {
          const color = new Color(Color.random());
          expect(Array.isArray(color[generator]())).toEqual(true);
        });
        it('should return no more than the limit', () => {
          const color = new Color(Color.random());
          const limit = 10;
          const array = color[generator](limit);
          expect(array.length).toBeLessThanOrEqual(limit);
        });
      });
    });
  });
  describe('color information methods', () => {
    describe('contrast', () => {
      const blue = new Color('blue');
      const white = new Color('white');
      const ratio = 8.59;

      it('should return a number', () => {
        expect(typeof blue.contrast(white)).toEqual('number');
      });
      it('should accept a color string as input', () => {
        expect(() => blue.contrast('white')).not.toThrow();
      });
      it('should accept a color object as input', () => {
        expect(() => blue.contrast({ r: 255, g: 255, b: 255 })).not.toThrow();
      });
      it('should return the correct contrast ratio', () => {
        expect(blue.contrast(white)).toEqual(ratio);
      });
    });
  });
  describe('user preferences', () => {
    describe('color space', () => {
      it('should set a users preferred color space', () => {
        const color = new Color('red');
        color.colorSpace = 'hsl';
        expect(color.value()).toEqual('hsl(0deg, 100%, 50%)');
        color.colorSpace = 'rgb';
        expect(color.value()).toEqual('rgb(255, 0, 0)');
        color.colorSpace = 'hex';
        expect(color.value()).toEqual('#FF0000');
        const red = new Color('red');
        expect(red.colorSpace).toEqual('hex');
      });
    });
  });
});
