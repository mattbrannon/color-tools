const {
  isFloat,
  isHex,
  isRgb,
  isHsl,
  isNamedColor,
  addHash,
  removeHash,
  keepHueInRange,
  keepAlphaInRange,
  keepRgbInRange,
  keepPercentInRange,
  toFloat,
  getDirection,
} = require('../src/utils');

describe('utils', () => {
  test('isFloat', () => {
    expect(isFloat(Math.random().toString())).toBe(true);
  });
  test('isHex', () => {
    expect(isHex('#00ff0f')).toBe(true);
  });
  test('isRgb', () => {
    expect(isRgb('rgb(212,88,34)')).toBe(true);
  });
  test('isHsl', () => {
    expect(isHsl('hsl(210,44,88)')).toBe(true);
  });
  test('isNamedColor', () => {
    expect(isNamedColor('blue')).toBe(true);
  });
  test('addHash', () => {
    expect(addHash('449449')).toBe('#449449');
  });
  test('removeHash', () => {
    expect(removeHash('#449449')).toBe('449449');
  });
  test('keepHueInRange', () => {
    expect(keepHueInRange(480)).toBe(120);
  });
  test('keepAlphaInRange', () => {
    expect(keepAlphaInRange(1.97)).toBe(1);
  });
  test('keepRgbInRange', () => {
    expect(keepRgbInRange(256)).toBe(255);
  });
  test('keepPercentInRange', () => {
    expect(keepPercentInRange(101)).toBe(100);
  });
  test('toFloat', () => {
    expect(toFloat(1.4859393)).toEqual(1.49);
  });
  test('getDirection', () => {
    const res = getDirection(240, 360);
    expect(res.direction).toEqual(1);
    expect(res.distance).toEqual(120);
    expect(res.longest).toEqual(240);
  });
});
