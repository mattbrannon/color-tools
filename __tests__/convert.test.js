const { convert } = require('../src/convert');

describe('Color conversion tests', () => {
  const hex = '#ff00ff';
  const rgb = [ 255, 0, 255 ];
  const hsl = [ 300, 100, 50 ];
  const hsv = [ 300, 100, 100 ];
  const cmyk = [ 0, 100, 0, 0 ];

  describe('hexToRgb', () => {
    it('should convert hex to rgb', () => {
      expect(convert.hexToRgb(hex)).toEqual(rgb);
    });
  });
  describe('hexToHsl', () => {
    it('should convert hex to hsl', () => {
      expect(convert.hexToHsl(hex)).toEqual(hsl);
    });
  });
  describe('hexToHsv', () => {
    it('should convert hex to hsv', () => {
      expect(convert.hexToHsv(hex)).toEqual(hsv);
    });
  });
  describe('hexToCmyk', () => {
    it('should convert hex to cmyk', () => {
      expect(convert.hexToCmyk(hex)).toEqual(cmyk);
    });
  });

  describe('rgbToHex', () => {
    it('should convert rgb to hex', () => {
      expect(convert.rgbToHex(rgb)).toEqual(hex);
    });
  });
  describe('rgbToHsl', () => {
    it('should convert rgb to hsl', () => {
      expect(convert.rgbToHsl(rgb)).toEqual(hsl);
    });
  });
  describe('rgbToHsv', () => {
    it('should convert rgb to hsv', () => {
      expect(convert.rgbToHsv(rgb)).toEqual(hsv);
    });
  });
  describe('rgbToCmyk', () => {
    it('should convert rgb to cmyk', () => {
      expect(convert.rgbToCmyk(rgb)).toEqual(cmyk);
    });
  });

  describe('hslToRgb', () => {
    it('should convert hsl to rgb', () => {
      expect(convert.hslToRgb(hsl)).toEqual(rgb);
    });
  });

  describe('hslToHex', () => {
    it('should convert hsl to hex', () => {
      expect(convert.hslToHex(hsl)).toEqual(hex);
    });
  });

  describe('hslToHsv', () => {
    it('should convert hsl to hsv', () => {
      expect(convert.hslToHsv(hsl)).toEqual(hsv);
    });
  });

  describe('hslToCmyk', () => {
    it('should convert hsl to cmyk', () => {
      expect(convert.hslToCmyk(hsl)).toEqual(cmyk);
    });
  });

  describe('hsvToHex', () => {
    it('should convert hsv to hex', () => {
      expect(convert.hsvToHex(hsv)).toEqual(hex);
    });
  });
  describe('hsvToRgb', () => {
    it('should convert hsv to rgb', () => {
      expect(convert.hsvToRgb(hsv)).toEqual(rgb);
    });
  });
  describe('hsvToHsl', () => {
    it('should convert hsv to hsl', () => {
      expect(convert.hsvToHsl(hsv)).toEqual(hsl);
    });
  });

  describe('hsvToCmyk', () => {
    it('should convert hsv to cmyk', () => {
      expect(convert.hsvToCmyk(hsv)).toEqual(cmyk);
    });
  });

  describe('cmykToHex', () => {
    it('should convert cmyk to hex', () => {
      expect(convert.cmykToHex(cmyk)).toEqual(hex);
    });
  });
  describe('cmykToRgb', () => {
    it('should convert cmyk to rgb', () => {
      expect(convert.cmykToRgb(cmyk)).toEqual(rgb);
    });
  });
  describe('cmykToHsl', () => {
    it('should convert cmyk to hsl', () => {
      expect(convert.cmykToHsl(cmyk)).toEqual(hsl);
    });
  });
  describe('cmykToHsv', () => {
    it('should convert cmyk to hsv', () => {
      expect(convert.cmykToHsv(cmyk)).toEqual(hsv);
    });
  });
});
