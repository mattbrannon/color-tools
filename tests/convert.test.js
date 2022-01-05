/* eslint-disable no-undef */

import { expect } from 'chai';
import convert from '../converter/index.js';

describe('Color conversion tests', () => {
  const hex = '#ff00ff';
  const rgb = { r: 255, g: 0, b: 255 };
  const hsl = { h: 300, s: 100, l: 50 };

  describe('hex2rgb', () => {
    it('should convert hex to rgb', () => {
      expect(convert.hex2rgb('#ff00ff')).to.deep.equal(rgb);
    });
  });
  describe('hex2hsl', () => {
    it('should convert hex to hsl', () => {
      expect(convert.hex2hsl('#ff00ff')).to.deep.equal(hsl);
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
});
