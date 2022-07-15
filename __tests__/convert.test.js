const { convert } = require('../dist/colorTools.cjs');

describe('Color conversion tests', () => {
  const hex = '#ff00ff';
  const rgb = { r: 255, g: 0, b: 255 };
  const hsl = { h: 300, s: 100, l: 50 };
  const hsv = { h: 300, s: 100, v: 100 };

  describe('hex2rgb', () => {
    it('should convert hex to rgb', () => {
      expect(convert.hex2rgb(hex)).toEqual(rgb);
    });
  });
  describe('hex2hsl', () => {
    it('should convert hex to hsl', () => {
      expect(convert.hex2hsl(hex)).toEqual(hsl);
    });
  });
  describe('hex2hsv', () => {
    it('should convert hex to hsv', () => {
      expect(convert.hex2hsv(hex)).toEqual(hsv);
    });
  });

  describe('rgb2hex', () => {
    it('should convert rgb to hex', () => {
      expect(convert.rgb2hex(rgb)).toEqual(hex);
    });
  });
  describe('rgb2hsl', () => {
    it('should convert rgb to hsl', () => {
      expect(convert.rgb2hsl(rgb)).toEqual(hsl);
    });
  });
  describe('rgb2hsv', () => {
    it('should convert rgb to hsv', () => {
      expect(convert.rgb2hsv(rgb)).toEqual(hsv);
    });
  });

  describe('hsl2rgb', () => {
    it('should convert hsl to rgb', () => {
      expect(convert.hsl2rgb(hsl)).toEqual(rgb);
    });
  });

  describe('hsl2hex', () => {
    it('should convert hsl to hex', () => {
      expect(convert.hsl2hex(hsl)).toEqual(hex);
    });
  });

  describe('hsl2hsv', () => {
    it('should convert hsl to hsv', () => {
      expect(convert.hsl2hsv(hsl)).toEqual(hsv);
    });
  });

  describe('hsv2hex', () => {
    it('should convert hsv to hex', () => {
      expect(convert.hsv2hex(hsv)).toEqual(hex);
    });
  });
  describe('hsv2rgb', () => {
    it('should convert hsv to rgb', () => {
      expect(convert.hsv2rgb(hsv)).toEqual(rgb);
    });
  });
  describe('hsv2hsl', () => {
    it('should convert hsv to hsl', () => {
      expect(convert.hsv2hsl(hsv)).toEqual(hsl);
    });
  });
});
