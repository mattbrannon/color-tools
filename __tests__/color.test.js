const { Color } = require('../dist/colorTools.cjs');
const {
  utils: { isHex },
} = require('../dist/colorTools.cjs');

describe('Color class', () => {
  const red = new Color('red');
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

  describe('properties', () => {
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
    sharedMethods.forEach((method) => {
      describe(`${method} method`, () => {
        it(`should have a ${method} method on the instance`, () => {
          const color = new Color(Color.random());
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
        it('should not modify the original instance', () => {
          const color1 = new Color(Color.random());
          const color2 = color1[method](50);
          const color1Values = color1.rgb.array();
          const color2Values = color2.rgb.array();
          expect(color1Values).not.toEqual(color2Values);
        });
      });
    });
  });
});
