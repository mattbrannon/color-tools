import {
  getColorSpaceFromString,
  sanitize,
  stripPercent,
  convertAlpha,
} from '../utils/index.js';

const stripDegFromHue = (hue) => {
  if (typeof hue === 'string') {
    return hue.match(/-?\d+\.?\d?/g).map(Number)[0];
  }
  return hue;
};

const keepHueInRange = (hue) => {
  hue = Number(hue);
  while (hue > 360 || hue < 0) {
    hue = hue > 360 ? hue - 360 : hue < 0 ? hue + 360 : hue;
  }
  return hue;
};

const keepPercentInRange = (n) => {
  n = Number(n);
  return (n = n < 0 ? 0 : n > 100 ? 100 : n);
};

const getHslValuesFromString = (str) => {
  return str
    .split(/\s+|,|\(|\)/g)
    .filter((val) => /\d+/g.test(val))
    .map((value, i) => {
      return i === 0
        ? keepHueInRange(stripDegFromHue(value))
        : i < 3
        ? keepPercentInRange(stripPercent(value))
        : i === 3
        ? convertAlpha(value)
        : value;
    });
};

const verifyFormat = (str, values) => {
  str = sanitize(str);
  let format = getColorSpaceFromString(str);
  format =
    format.length === values.length
      ? format
      : format.length < values.length
      ? format + 'a'
      : format.length > values.length
      ? format.slice(0, -1)
      : null;

  return format;
};

const parseString = (str) => {
  const values = getHslValuesFromString(str);
  const format = verifyFormat(str, values);
  return { format, values };
};

const toObject = (str) => {
  const { values, format } = parseString(str);
  return values.reduce((acc, val, i) => {
    const key = format[i];
    acc[key] = val;
    return acc;
  }, {});
};

const setDetails = (num, i) => {
  return i === 0 ? num + 'deg' : i < 3 ? num + '%' : num;
};

const toString = (object) => {
  const format = Object.keys(object).join('');
  const values = Object.values(object).map(setDetails);

  return `${format}(${values.join(', ')})`;
};

const parseHSL = (str) => {
  return {
    css: () => toString(toObject(str)),
    object: () => toObject(str),
    array: () => getHslValuesFromString(str),
  };
};

export { parseHSL, keepHueInRange };
