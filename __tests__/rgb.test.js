const {
  parseRgb,
  toObjectFromRgbArray,
  toStringFromRgbArray,
} = require('../src/rgb');
const { keepRgbInRange } = require('../src/utils');

describe('rgb.js tests', () => {
  describe('keepRgbInRange', () => {
    it('should not exceed 255', () => {
      expect(keepRgbInRange(300)).toEqual(255);
    });
    it('should not be lower than 0', () => {
      expect(keepRgbInRange(-1)).toEqual(0);
    });
    it('should return the value unmodified', () => {
      expect(keepRgbInRange(45)).toEqual(45);
    });
  });
  describe('parseRgb', () => {
    const input = 'rgb(210, 45, 90)';
    const input2 = 'rgb(50%, 90%, 25%, 0.25)';
    const input3 = 'rgb(190, 24, 200, 12)';

    it('should be an object', () => {
      expect(typeof parseRgb(input)).toEqual('object');
    });
    it('should have an array method', () => {
      const parsed = parseRgb(input);
      expect(parsed).toHaveProperty('array');
    });
    it('should have an object method', () => {
      const parsed = parseRgb(input);
      expect(parsed).toHaveProperty('object');
    });
    it('should have a css method', () => {
      const parsed = parseRgb(input);
      expect(parsed).toHaveProperty('css');
    });
    it('should return an array of rgb values', () => {
      const parsed = parseRgb(input);
      expect(parsed.array()).toEqual([ 210, 45, 90 ]);
    });
    it('should return an object of rgb values', () => {
      const parsed = parseRgb(input);
      expect(parsed.object()).toEqual({ r: 210, g: 45, b: 90 });
    });
    it('should return a valid rgb css string', () => {
      const parsed = parseRgb(input);
      expect(parsed.css()).toEqual('rgb(210, 45, 90)');
    });

    it('should handle percentages', () => {
      const parsed = parseRgb(input2);
      expect(parsed.array()).toEqual([ 128, 230, 64, 0.25 ]);
      expect(parsed.object()).toEqual({ r: 128, g: 230, b: 64, a: 0.25 });
      expect(parsed.css()).toEqual('rgb(128, 230, 64, 0.25)');
    });
    it('should convert alpha greater than 1 to float', () => {
      const parsed = parseRgb(input3);
      expect(parsed.array()).toEqual([ 190, 24, 200, 0.12 ]);
    });
  });
  describe('input arrays', () => {
    it('should handle an array as input', () => {
      expect(toObjectFromRgbArray([ 190, 24, 200, 0.12 ])).toEqual({
        r: 190,
        g: 24,
        b: 200,
        a: 0.12,
      });
      expect(toStringFromRgbArray([ 190, 24, 200, 0.12 ])).toEqual(
        'rgb(190, 24, 200, 0.12)'
      );

      expect(parseRgb([ 100, 100, 100 ]).array()).toEqual([ 100, 100, 100 ]);
      expect(parseRgb([ 100, 100, 100 ]).object()).toEqual({
        r: 100,
        g: 100,
        b: 100,
      });
      expect(parseRgb([ 100, 100, 100 ]).css()).toEqual('rgb(100, 100, 100)');
    });
  });
});
