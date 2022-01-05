import { expect } from 'chai';
import assert from 'assert';
// import describe from 'mocha';
import * as hsl from '../lib/hsl.js';

const {
  getHslValuesFromString,
  keepHueInRange,
  keepPercentInRange,
  parseHSL,
  parseString,
  stripDegFromHue,
  toObject,
  toString,
  verifyFormat,
} = hsl;

describe('hsl.js tests', () => {
  describe('getHslValuesFromString, tests', () => {
    it('should return an array of hsl values', () => {
      const result = getHslValuesFromString('hsl(120, 100%, 50%)');
      expect(result).to.deep.equal([120, 100, 50]);
    });
  });

  describe('keepHueInRange Test', () => {
    it('should keep the hue between 0 and 360', () => {
      const result = keepHueInRange(480);
      expect(result).to.equal(120);
    });
    it('should keep the hue between 0 and 360', () => {
      const result = keepHueInRange(-480);
      expect(result).to.equal(240);
    });
    it('should not modify the hue when in range', () => {
      const result = keepHueInRange(45);
      expect(result).to.equal(45);
    });
  });
  describe('keepPercentInRange Test', () => {
    it('should keep percentages between 0 and 100', () => {
      const result = keepPercentInRange(120);
      expect(result).to.equal(100);
    });
    it('should keep percentages between 0 and 100', () => {
      const result = keepPercentInRange(-20);
      expect(result).to.equal(0);
    });
    it('should not modify percentages between 0 and 100', () => {
      const result = keepPercentInRange(50);
      expect(result).to.equal(50);
    });
  });
  describe('stripDegFromHue Test', () => {
    it('should return a number', () => {
      const result = stripDegFromHue('345deg');
      expect(result).to.be.a('number');
    });
    it('should return the the correct value', () => {
      const result = stripDegFromHue('345deg');
      expect(result).to.equal(345);
    });
    it('should work if deg string not present', () => {
      const result = stripDegFromHue('345');
      expect(result).to.equal(345);
    });
    it('should work if already a number', () => {
      const result = stripDegFromHue(345);
      expect(result).to.equal(345);
    });
  });

  describe('parseString Test', () => {
    it('should parse an hsl string correctly', () => {
      const result = parseString('hsl(120, 100%, 50%');
      expect(result).to.deep.equal({ format: 'hsl', values: [120, 100, 50] });
    });
    it('should return an object with keys `format` and `values`', () => {
      const obj = parseString('hsl(220, 100, 40');
      expect(obj).to.haveOwnProperty('format');
      expect(obj).to.haveOwnProperty('values');
    });
    it('should be hsl format', () => {
      const obj = parseString('hsl(220, 100, 40');
      expect(obj.format).to.deep.equal('hsl');
    });
    it('should be hsla format', () => {
      const obj = parseString('hsla(220, 100, 40, 0.5');
      expect(obj.format).to.deep.equal('hsla');
    });
    it('should be an array of numbers', () => {
      const obj = parseString('hsla(220deg, 100%, 40%, 0.5');
      const isNumbers = obj.values.every((value) => typeof value === 'number');
      expect(isNumbers).to.be.true;
    });
    it('should return the correct array values', () => {
      const obj = parseString('hsla(220deg, 100%, 40%, 0.5');
      expect(obj.values).to.deep.equal([220, 100, 40, 0.5]);
    });
  });

  describe('toObject Test', () => {
    const str1 = 'hsl(120, 100%, 50%)';
    const str2 = 'hsl(120, 100%, 50%, 0.5)';
    const str3 = 'hsl(120, 100%, 50%, 50%)';
    const str4 = 'hsl(120deg, 100%, 50%)';
    const str5 = 'hsl(120, 100, 50, 0.5)';
    const str6 = 'hsl(120 100% 50% 50%)';

    const output1 = { h: 120, s: 100, l: 50 };
    const output2 = { h: 120, s: 100, l: 50, a: 0.5 };

    it('should return an hsl object from a string', () => {
      const result = toObject(str1);
      expect(result).to.deep.equal(output1);
    });
    it('should return an hsl object from a string', () => {
      const result = toObject(str2);
      expect(result).to.deep.equal(output2);
    });
    it('should return an hsl object from a string', () => {
      const result = toObject(str3);
      expect(result).to.deep.equal(output2);
    });
    it('should return an hsl object from a string', () => {
      const result = toObject(str4);
      expect(result).to.deep.equal(output1);
    });
    it('should return an hsl object from a string', () => {
      const result = toObject(str5);
      expect(result).to.deep.equal(output2);
    });
    it('should return an hsl object from a string', () => {
      const result = toObject(str6);
      expect(result).to.deep.equal(output2);
    });
  });

  describe('toString Test', () => {
    const input1 = { h: 120, s: 100, l: 50 };
    const input2 = { h: 120, s: 100, l: 50, a: 0.5 };

    const output1 = 'hsl(120deg, 100%, 50%)';
    const output2 = 'hsla(120deg, 100%, 50%, 0.5)';

    it('should return an hsl string from an object', () => {
      const result = toString(input1);
      expect(result).to.deep.equal(output1);
    });
    it('should return an hsl string from an object', () => {
      const result = toString(input2);
      expect(result).to.deep.equal(output2);
    });
  });
});
