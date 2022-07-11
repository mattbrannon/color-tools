/* eslint-disable no-undef */

import { expect } from 'chai';
import Color from '../lib/color.js';
import { isValidHex } from '../lib/utils.js';

describe('Color class', () => {
  const red1 = new Color('red');
  const red2 = new Color('#ff0000');
  const red3 = new Color('rgb(255, 0, 0)');
  // const red4 = new Color('hsl(0, 100%, 50%)');

  const methods = [
    'css',
    'array',
    'object',
    'shades',
    'tints',
    'faded',
    'vibrant',
    'random',
  ];

  describe('static methods', () => {
    describe('random', () => {
      it('should exist', () => {
        expect(Color.random()).to.exist;
      });
      it('should be a function', () => {
        expect(typeof Color.random).to.equal('function');
      });
      it('should return a valid hex string', () => {
        expect(isValidHex(Color.random())).to.be.true;
      });
      it('should return a random hex string', () => {
        const hex1 = Color.random();
        const hex2 = Color.random();
        expect(hex1).to.not.equal(hex2);
      });
    });
    describe('constrast', () => {
      it('should exist', () => {
        expect(Color.contrast).to.exist;
      });
      it('should be a function', () => {
        expect(typeof Color.contrast).to.equal('function');
      });
      it('should return a number', () => {
        const ratio = Color.contrast('blue', 'green');
        expect(typeof ratio).to.equal('number');
      });
      it('should return the correct contrast ratio', () => {
        const ratio = Color.contrast('blue', 'green');
        expect(ratio).to.equal(1.67);
      });
    });
  });

  describe('properties', () => {
    describe('hex', () => {
      it('should have a hex property', () => {
        expect(red1.hex).to.exist;
      });
      it('should have methods attached', () => {
        Object.keys(red1.hex).forEach((property) => {
          expect(methods.includes(property)).to.be.true;
        });
      });
    });
    describe('rgb', () => {
      it('should have an rgb property', () => {
        expect(red2.rgb).to.exist;
      });
      it('should have methods attached', () => {
        Object.keys(red2.rgb).forEach((property) => {
          expect(methods.includes(property)).to.be.true;
        });
      });
    });
    describe('hsl', () => {
      it('should have an hsl property', () => {
        expect(red3.hsl).to.exist;
      });
      it('should have methods attached', () => {
        Object.keys(red3.hsl).forEach((property) => {
          expect(methods.includes(property)).to.be.true;
        });
      });
    });
  });

  describe('methods', () => {
    describe('set', () => {
      const color1 = new Color('blue');
      const color2 = color1.set.red(100);
      it('should return an instance of color', () => {
        expect(color2).to.be.instanceOf(Color);
      });
      it('should return a new instance of color', () => {
        expect(Object.is(color1, color2)).to.be.false;
      });
      it('should not modify the original color', () => {
        expect(color2.hex.css()).to.not.equal(color1.hex.css());
      });
    });
  });
});
