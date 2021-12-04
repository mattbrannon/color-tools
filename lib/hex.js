import { sanitize, isValidHex, isShortHex } from '../utils/index.js';

const addHash = (s) => {
  return s.charAt(0) === '#' ? s : '#' + s;
};

const removeHash = (s) => {
  return s.charAt(0) === '#' ? s.substring(1) : s;
};

const makeLongHex = (s) => {
  s = sanitize(s);
  if (isShortHex(s)) {
    s = removeHash(s);
    s = s
      .split('')
      .map((char) => char.repeat(2))
      .join('');
  }
  return addHash(s);
};

const validateHex = (s) => {
  return isValidHex(s) ? makeLongHex(s) : null;
};

const hexToArray = (s) => {
  const hex = removeHash(sanitize(s));
  const array = [];
  for (let i = 1; i < hex.length; i += 2) {
    const digit = hex[i - 1] + hex[i];
    array.push(digit);
  }
  return array;
};

const hexToObject = (s) => {
  const arr = hexToArray(s);
  return arr.reduce((acc, value, i) => {
    i === 0
      ? (acc.h = value)
      : i === 1
      ? (acc.e = value)
      : i === 2
      ? (acc.x = value)
      : (acc.a = value);
    return acc;
  }, {});
};

export { removeHash, validateHex, hexToArray, hexToObject };
