/* eslint-disable no-undef */

import { expect } from 'chai';
import hex from '../lib/hex.js';
const {
  addHash,
  removeHash,
  makeLongHex,
  validateHex,
  hexToArray,
  hexToObject,
} = hex;

describe('hex.js tests', () => {
  describe('addHash tests', () => {
    it('should add a hash', () => {
      const result = addHash('123456');
      expect(result).to.equal('#123456');
    });
    it('should not add a hash if already present', () => {
      const result = addHash('#123456');
      expect(result).to.equal('#123456');
    });
  });

  describe('removeHash Test', () => {
    it('should remove a hash', () => {
      const result = removeHash('#123456');
      expect(result).to.equal('123456');
    });
    it('should not modify string if hash not present', () => {
      const result = removeHash('123456');
      expect(result).to.equal('123456');
    });
  });
  describe('makeLongHex Test', () => {
    it('should convert a short hexcode to long form', () => {
      const result = makeLongHex('#456');
      expect(result).to.equal('#445566');
    });
    it('should convert to long form regardless without hash present', () => {
      const result = makeLongHex('456');
      expect(result).to.equal('#445566');
    });
    it('should not modify if already in long form', () => {
      const result = makeLongHex('#445566');
      expect(result).to.equal('#445566');
    });
  });
  describe('validateHex Test', () => {
    it('should return a valid hexcode', () => {
      const result = validateHex('123');
      expect(result).to.equal('#112233');
    });
    it('should return a valid hexcode', () => {
      const result = validateHex('123456');
      expect(result).to.equal('#123456');
    });
    it('should return a valid hexcode', () => {
      const result = validateHex('#123456');
      expect(result).to.equal('#123456');
    });
    it('should return null for invalid input', () => {
      const result = validateHex('12345p');
      expect(result).to.equal(null);
    });
  });
  describe('hexToArray Test', () => {
    it('should split hex into [r, g, b]', () => {
      const result = hexToArray('#a1b2c3');
      expect(result).to.deep.equal([ 'a1', 'b2', 'c3' ]);
    });
  });
  describe('hexToObject Test', () => {
    it('should convert hex to { h, e, x }', () => {
      const result = hexToObject('#123456');
      expect(result).to.deep.equal({ h: '12', e: '34', x: '56' });
    });
  });
});
