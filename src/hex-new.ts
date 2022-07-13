export const removePrefix = (prefix: string) => (s: string) => {
  return s.charAt(0) === prefix ? s.slice(1) : s;
};

export const addPrefix = (prefix: string) => (s: string) => {
  return s.charAt(0) !== prefix ? prefix + s : s;
};

export const removeHash = removePrefix('#');
export const addHash = addPrefix('#');

export const isHex = (s: any) => {
  const re = /^#?([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/gi;
  return typeof s === 'string' && re.test(s);
};

export const isShort = (s: string) => {
  return isHex(s) && removeHash(s).length <= 4;
};

export const canBeShort = (s: string) => {
  return Array.from(s).every((char, i, coll) => {
    return i % 2 === 0 ? char === coll[i + 1] : char === coll[i - 1];
  });
};

export const isLong = (s: string) => {
  return isHex(s) && removeHash(s).length >= 6;
};

export const hasAlpha = (s: string) => {
  return isLong(s) && removeHash(s).length > 6;
};

export const makeShort = (s: string) => {
  if (isLong(s)) {
    return addHash(
      Array.from(removeHash(s))
        .filter((_, i) => i % 2 === 0)
        .join('')
    );
  }
  return addHash(s);
};

export const makeLong = (s: string) => {
  if (isShort(s)) {
    return addHash(
      Array.from(removeHash(s))
        .map((v) => v.repeat(2))
        .join('')
    );
  }
  return addHash(s);
};

export const parseHex = (s: string) => {
  return makeLong(s);
};

// export const parseHex = (s: string) => {
//   const longHex = makeLong(s);
//   const hex = hasAlpha(longHex) ? longHex.slice(0, 7) : longHex;
//   return {
//     hex,
//     alpha: hasAlpha(longHex) ? longHex : null,
//   };
// };
