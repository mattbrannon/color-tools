const { Color } = require('../dist/colorTools.cjs');
const {
  utils: { isHex },
} = require('../dist/colorTools.cjs');

describe('Color class', () => {
  const red1 = new Color('red');
  // const red2 = new Color('#ff0000');
  // const red3 = new Color('rgb(255, 0, 0)');

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

  describe('properties', () => {
    properties.forEach((property) => {
      describe(property, () => {
        it(`should have a ${property} property`, () => {
          expect(red1[property]).toBeDefined();
        });
        describe(`${property} should have methods attached`, () => {
          methods.forEach((method) => {
            it(`${property} property should have a ${method} method`, () => {
              expect(red1.hex[method]).toBeDefined();
            });
          });
        });
      });
    });
  });
});

// import { Color } from '../dist/lib/color.js';
// import { isHex } from '../dist/lib/hex-new.js';

// describe('Color class', () => {
//   const red1 = new Color('red');
//   const red2 = new Color('#ff0000');
//   const red3 = new Color('rgb(255, 0, 0)');
//   // const red4 = new Color('hsl(0, 100%, 50%)');

//   const methods = [
//     'css',
//     'array',
//     'object',
//     'shades',
//     'tints',
//     'faded',
//     'vibrant',
//     'random',
//   ];

// describe('static methods', () => {
//   describe('random', () => {
//     it('should exist', () => {
//       expect(Color.random()).toBeDefined;
//     });
//     it('should be a function', () => {
//       expect(typeof Color.random).toEqual('function');
//     });
// it('should return a valid hex string', () => {
//   expect(isHex(Color.random())).toEqual(true);
// });
//     it('should return a random hex string', () => {
//       const hex1 = Color.random();
//       const hex2 = Color.random();
//       expect(hex1).not.toEqual(hex2);
//     });
//   });
//   describe('constrast', () => {
//     it('should exist', () => {
//       expect(Color.contrast).toBeDefined;
//     });
//     it('should be a function', () => {
//       expect(typeof Color.contrast).toEqual('function');
//     });
//     it('should return a number', () => {
//       const ratio = Color.contrast('blue', 'green');
//       expect(typeof ratio).toEqual('number');
//     });
//     it('should return the correct contrast ratio', () => {
//       const ratio = Color.contrast('blue', 'green');
//       expect(ratio).toEqual(1.67);
//     });
//   });
// });

// describe('methods', () => {
//   describe('set', () => {
//     const color1 = new Color('blue');
//     const color2 = color1.set.red(100);
//     it('should return an instance of color', () => {
//       expect(color2).toBeInstanceOf(Color);
//     });
//     it('should return a new instance of color', () => {
//       expect(Object.is(color1, color2)).toEqual(false);
//     });
//     it('should not modify the original color', () => {
//       expect(color2.hex.css()).not.toEqual(color1.hex.css());
//     });
//   });
// });
// });
