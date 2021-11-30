const sanitize = (str) => {
  return str.replace(/\s+/g, '').trim().toLowerCase();
};

const isPercent = (value) => {
  if (typeof value === 'string') {
    return value.includes('%');
  }
  return false;
};

const getColorFormatFromString = (str) => {
  return str.slice(0, str.indexOf('('));
};

const toFloat = (n) => Math.round(n * 10000) / 10000;

const isFloat = (num) => {
  const n = Number(num);
  const isNumber = typeof n === 'number';
  const hasDecimal = isNumber && n.toString().match(/\d+\.\d+/g) !== null;
  return !Number.isNaN(n) && isNumber && hasDecimal;
};

const keepRgbInRange = (num) => {
  return num < 0 ? 0 : num > 255 ? 255 : num;
};

const stripPercent = (str) => {
  if (typeof str === 'string') {
    const i = str.indexOf('%');
    return i > -1 ? str.slice(0, i) : str;
  }
  return str;
};

const convertPercentToRgb = (num) => {
  const n = stripPercent(num);
  const converted = Math.min(Math.round(toFloat((n * 255) / 100)), 255);
  return converted > 0 ? converted : 0;
};

const convertAlpha = (alpha) => {
  let result;
  if (isPercent(alpha)) {
    const isNegative = Math.sign(stripPercent(alpha)) <= 0;
    const n = [stripPercent(alpha)].map(Number).map((val) => val / 100)[0];
    result = isNegative ? 0 : n;
  } else if (Math.sign(alpha) > -1) {
    result = toFloat(alpha);
  } else {
    return 0;
  }
  return result > 1 ? 1 : result < 0 ? 0 : result;
};

const getValuesFromString = (str) => {
  return str
    .split(/\s+|,|\(|\)/g)
    .filter((val) => /\d+/g.test(val))
    .map((value, i) => {
      return i < 3
        ? value.includes('%')
          ? convertPercentToRgb(value)
          : keepRgbInRange(value)
        : convertAlpha(value);
    })
    .map(Number);
};

const verifyFormat = (str, values) => {
  str = sanitize(str);
  let format = getColorFormatFromString(str);
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
  const values = getValuesFromString(str);
  const format = verifyFormat(str, values);
  return { format, values };
};

const toObject = (str) => {
  const { format, values } = parseString(str);
  return values.reduce((acc, val, i) => {
    const key = format[i];
    acc[key] = val;
    return acc;
  }, {});
};

const setValues = (num, index) => {
  return index < 3 ? keepRgbInRange(num) : num;
};

const toString = (object) => {
  const format = Object.keys(object).join('');
  const values = Object.values(object).map(setValues);

  return `${format}(${values.join(', ')})`;
};

const parseRGB = (str) => {
  return {
    css: () => toString(toObject(str)),
    object: () => toObject(str),
    array: () => getValuesFromString(str),
  };
};

export default parseRGB;
