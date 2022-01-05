/* eslint-disable no-undef */

import { expect } from 'chai';
import * as rgb from '../lib/rgb.js';

const { convertPercentToRgb, parseRGB, keepRgbInRange } = rgb;

describe('rgb.js tests', () => {
  describe('convertPercentToRgb', () => {
    it('should convert percentage value to rgb', () => {
      expect(convertPercentToRgb('-30')).to.equal(0);
      expect(convertPercentToRgb('0%')).to.equal(0);
      expect(convertPercentToRgb('50')).to.equal(128);
      expect(convertPercentToRgb('40%')).to.equal(102);
      expect(convertPercentToRgb('10%')).to.equal(26);
      expect(convertPercentToRgb('100')).to.equal(255);
      expect(convertPercentToRgb('140%')).to.equal(255);
    });
  });
  describe('keepRgbInRange', () => {
    it('should not exceed 255', () => {
      expect(keepRgbInRange(300)).to.equal(255);
    });
    it('should not be lower than 0', () => {
      expect(keepRgbInRange(-1)).to.equal(0);
    });
    it('should return the value unmodified', () => {
      expect(keepRgbInRange(45)).to.equal(45);
    });
  });
  describe('parseRGB', () => {
    const input = 'rgb(210, 45, 90)';
    const input2 = 'rgb(50% 90% 25% 0.25)';

    it('should be an object', () => {
      expect(typeof parseRGB(input)).to.equal('object');
    });
    it('should have an array method', () => {
      const parsed = parseRGB(input);
      expect(parsed).to.haveOwnProperty('array');
    });
    it('should have an object method', () => {
      const parsed = parseRGB(input);
      expect(parsed).to.haveOwnProperty('object');
    });
    it('should have a css method', () => {
      const parsed = parseRGB(input);
      expect(parsed).to.haveOwnProperty('css');
    });
    it('should return an array of rgb values', () => {
      const parsed = parseRGB(input);
      expect(parsed.array()).to.deep.equal([ 210, 45, 90 ]);
    });
    it('should return an object of rgb values', () => {
      const parsed = parseRGB(input);
      expect(parsed.object()).to.deep.equal({ r: 210, g: 45, b: 90 });
    });
    it('should return a valid rgb css string', () => {
      const parsed = parseRGB(input);
      expect(parsed.css()).to.equal('rgb(210, 45, 90)');
    });

    it('should handle percentages', () => {
      const parsed = parseRGB(input2);
      expect(parsed.array()).to.deep.equal([ 128, 230, 64, 0.25 ]);
      expect(parsed.object()).to.deep.equal({ r: 128, g: 230, b: 64, a: 0.25 });
      expect(parsed.css()).to.equal('rgba(128, 230, 64, 0.25)');
    });
  });
});
