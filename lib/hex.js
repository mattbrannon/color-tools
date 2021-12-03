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

export { removeHash, validateHex };
