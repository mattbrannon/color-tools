const { addHash, isHex, removeHash } = require('../src/utils');
const { parseHex } = require('../src/hex');

describe('hex.js tests', () => {
  describe('addHash tests', () => {
    it('should add a hash', () => {
      const result = addHash('123456');
      expect(result).toEqual('#123456');
    });
    it('should not add a hash if already present', () => {
      const result = addHash('#123456');
      expect(result).toEqual('#123456');
    });
  });

  describe('removeHash Test', () => {
    it('should remove a hash', () => {
      const result = removeHash('#123456');
      expect(result).toEqual('123456');
    });
    it('should not modify string if hash not present', () => {
      const result = removeHash('123456');
      expect(result).toEqual('123456');
    });
  });
  describe('makeLongHex Test', () => {
    it('should convert a short hexcode to long form', () => {
      const result = parseHex('#456').css();
      expect(result).toEqual('#445566');
    });
    it('should convert to long form regardless without hash present', () => {
      const result = parseHex('456').css();
      expect(result).toEqual('#445566');
    });
    it('should not modify if already in long form', () => {
      const result = parseHex('#445566').css();
      expect(result).toEqual('#445566');
    });
  });
  describe('validateHex Test', () => {
    it('should return a valid hexcode', () => {
      const result = parseHex('123').css();
      expect(result).toEqual('#112233');
    });
    it('should return a valid hexcode', () => {
      const result = parseHex('123456').css();
      expect(result).toEqual('#123456');
    });
    it('should return a valid hexcode', () => {
      const result = parseHex('#123456').css();
      expect(result).toEqual('#123456');
    });
    it('should return null for invalid input', () => {
      const result = isHex('12345p');
      expect(result).toEqual(false);
    });
  });
  describe('hexToArray Test', () => {
    it('should split hex into [r, g, b]', () => {
      const result = parseHex('#a1b2c3').array();
      expect(result).toEqual([ 'a1', 'b2', 'c3' ]);
    });
  });
  describe('hexToObject Test', () => {
    it('should convert hex to { h, e, x }', () => {
      const result = parseHex('#123456').object();
      expect(result).toEqual({ r: '12', g: '34', b: '56' });
    });
  });
});
