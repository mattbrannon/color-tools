/* eslint-disable no-undef */

import { expect } from 'chai';
import convert from '../converter/index.js';

describe('Color conversion tests', () => {
  const hex = '#ff00ff';
  const rgb = { r: 255, g: 0, b: 255 };
  const hsl = { h: 300, s: 100, l: 50 };
  const hsv = { h: 300, s: 100, v: 100 };

  describe('hex2rgb', () => {
    it('should convert hex to rgb', () => {
      expect(convert.hex2rgb(hex)).to.deep.equal(rgb);
    });
  });
  describe('hex2hsl', () => {
    it('should convert hex to hsl', () => {
      expect(convert.hex2hsl(hex)).to.deep.equal(hsl);
    });
  });
  describe('hex2hsv', () => {
    it('should convert hex to hsv', () => {
      expect(convert.hex2hsv(hex)).to.deep.equal(hsv);
    });
  });

  describe('rgb2hex', () => {
    it('should convert rgb to hex', () => {
      expect(convert.rgb2hex(rgb)).to.equal(hex);
    });
  });
  describe('rgb2hsl', () => {
    it('should convert rgb to hsl', () => {
      expect(convert.rgb2hsl(rgb)).to.deep.equal(hsl);
    });
  });
  describe('rgb2hsv', () => {
    it('should convert rgb to hsv', () => {
      expect(convert.rgb2hsv(rgb)).to.deep.equal(hsv);
    });
  });

  describe('hsl2rgb', () => {
    it('should convert hsl to rgb', () => {
      expect(convert.hsl2rgb(hsl)).to.deep.equal(rgb);
    });
  });

  describe('hsl2hex', () => {
    it('should convert hsl to hex', () => {
      expect(convert.hsl2hex(hsl)).to.equal(hex);
    });
  });

  describe('hsl2hsv', () => {
    it('should convert hsl to hsv', () => {
      expect(convert.hsl2hsv(hsl)).to.deep.equal(hsv);
    });
  });

  describe('hsv2hex', () => {
    it('should convert hsv to hex', () => {
      expect(convert.hsv2hex(hsv)).to.equal(hex);
    });
  });
  describe('hsv2rgb', () => {
    it('should convert hsv to rgb', () => {
      expect(convert.hsv2rgb(hsv)).to.deep.equal(rgb);
    });
  });
  describe('hsv2hsl', () => {
    it('should convert hsv to hsl', () => {
      expect(convert.hsv2hsl(hsv)).to.deep.equal(hsl);
    });
  });
});
