import { isHex, removeHash, addHash } from './utils';

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
  const hex = removeHash(makeLong(s));

  const array = Array.from(hex)
    .map((char, i, coll) => (i % 2 === 0 ? char + coll[i + 1] : null))
    .filter((v) => v);

  const object = array.reduce((acc, value, i) => {
    const keys = 'rgb';
    const key = i === 3 ? 'a' : keys[i];
    acc[key] = value;
    return acc;
  }, {});

  return {
    /**
     *
     * @returns an array with the hexadecimal bits of color split into their rgb counterparts
     */
    array: (): string[] => array,
    /**
     *
     * @returns an object with the hex string broken up into its rgb counterparts
     */
    object: (): {} => object,
    /**
     *
     * @returns a hexadecimal css color
     */
    css: (): string => addHash(hex),
  };
};

// export const parseHex = (s: string) => {
//   const longHex = makeLong(s);
//   const hex = hasAlpha(longHex) ? longHex.slice(0, 7) : longHex;
//   return {
//     hex,
//     alpha: hasAlpha(longHex) ? longHex : null,
//   };
// };
