const { convert } = require('../src/convert');

describe('hsv conversion tests', () => {
  describe('hexToHsv', () => {
    it('should convert hex to hsv', () => {
      const hex = '#ff0000';
      const actual = convert.hexToHsv(hex);
      // const expected = [ 0, s: 100, 100 ];
      const expected = [ 0, 100, 100 ];
      expect(actual).toEqual(expected);
    });
  });
  describe('hsvToHex', () => {
    it('should convert hsv to hex', () => {
      const hsv = [ 0, 100, 100 ];
      const actual = convert.hsvToHex(hsv);
      const expected = '#ff0000';
      expect(actual).toEqual(expected);
    });
  });
  describe('rgbToHsv', () => {
    it('should convert rgb to hsv', () => {
      const rgb = [ 255, 0, 0 ];
      const expected = [ 0, 100, 100 ];
      const actual = convert.rgbToHsv(rgb);
      expect(actual).toEqual(expected);
    });
  });
  describe('hsvToRgb', () => {
    it('should convert hsv to rgb', () => {
      const hsv = [ 0, 100, 100 ];
      const actual = convert.hsvToRgb(hsv);
      const expected = [ 255, 0, 0 ];
      expect(actual).toEqual(expected);
    });
  });
  describe('hslToHsv', () => {
    it('should convert hsl to hsv', () => {
      const hsl = [ 0, 100, 50 ];
      const actual = convert.hslToHsv(hsl);
      const expected = [ 0, 100, 100 ];
      expect(actual).toEqual(expected);
    });
  });
  describe('hsvToHsl', () => {
    it('should convert hsv to hsl', () => {
      const hsv = [ 0, 100, 100 ];
      const actual = convert.hsvToHsl(hsv);
      const expected = [ 0, 100, 50 ];
      expect(actual).toEqual(expected);
    });
  });
});
