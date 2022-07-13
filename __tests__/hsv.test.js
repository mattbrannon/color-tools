/* eslint-disable no-undef */

import { expect } from 'chai';
import { convert } from '../lib/convert.js';

describe('hsv conversion tests', () => {
  describe('hex2hsv', () => {
    it('should convert hex to hsv', () => {
      const hex = '#ff0000';
      const actual = convert.hex2hsv(hex);
      const expected = { h: 0, s: 100, v: 100 };
      expect(actual).to.deep.equal(expected);
    });
  });
  describe('hsv2hex', () => {
    it('should convert hsv to hex', () => {
      const hsv = { h: 0, s: 100, v: 100 };
      const actual = convert.hsv2hex(hsv);
      const expected = '#ff0000';
      expect(actual).to.deep.equal(expected);
    });
  });
  describe('rgb2hsv', () => {
    it('should convert rgb to hsv', () => {
      const rgb = { r: 255, g: 0, b: 0 };
      const expected = { h: 0, s: 100, v: 100 };
      const actual = convert.rgb2hsv(rgb);
      expect(actual).to.deep.equal(expected);
    });
  });
  describe('hsv2rgb', () => {
    it('should convert hsv to rgb', () => {
      const hsv = { h: 0, s: 100, v: 100 };
      const actual = convert.hsv2rgb(hsv);
      const expected = { r: 255, g: 0, b: 0 };
      expect(actual).to.deep.equal(expected);
    });
  });
  describe('hsl2hsv', () => {
    it('should convert hsl to hsv', () => {
      const hsl = { h: 0, s: 100, l: 50 };
      const actual = convert.hsl2hsv(hsl);
      const expected = { h: 0, s: 100, v: 100 };
      expect(actual).to.deep.equal(expected);
    });
  });
  describe('hsv2hsl', () => {
    it('should convert hsv to hsl', () => {
      const hsv = { h: 0, s: 100, v: 100 };
      const actual = convert.hsv2hsl(hsv);
      const expected = { h: 0, s: 100, l: 50 };
      expect(actual).to.deep.equal(expected);
    });
  });
});
