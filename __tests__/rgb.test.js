const {
  parseRgb,
  utils: { keepInRgbRange },
} = require('../dist/colorTools.cjs');

describe('rgb.js tests', () => {
  // describe('convertPercentToRgb', () => {
  //   it('should convert percentage value to rgb', () => {
  //     expect(convertPercentToRgb('-30')).toEqual(0);
  //     expect(convertPercentToRgb('0%')).toEqual(0);
  //     expect(convertPercentToRgb('50')).toEqual(128);
  //     expect(convertPercentToRgb('40%')).toEqual(102);
  //     expect(convertPercentToRgb('10%')).toEqual(26);
  //     expect(convertPercentToRgb('100')).toEqual(255);
  //     expect(convertPercentToRgb('140%')).toEqual(255);
  //   });
  // });
  describe('keepInRgbRange', () => {
    it('should not exceed 255', () => {
      expect(keepInRgbRange(300)).toEqual(255);
    });
    it('should not be lower than 0', () => {
      expect(keepInRgbRange(-1)).toEqual(0);
    });
    it('should return the value unmodified', () => {
      expect(keepInRgbRange(45)).toEqual(45);
    });
  });
  describe('parseRgb', () => {
    const input = 'rgb(210, 45, 90)';
    const input2 = 'rgb(50%, 90%, 25%, 0.25)';

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
  });
});
