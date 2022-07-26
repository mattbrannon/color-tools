import { isHex, removeHash, addHash } from './utils';
import { RgbHex } from './interfaces';

const isShort = (s: string) => {
  return isHex(s) && removeHash(s).length <= 4;
};

// const canBeShort = (s: string) => {
//   return Array.from(s).every((char, i, coll) => {
//     return i % 2 === 0 ? char === coll[i + 1] : char === coll[i - 1];
//   });
// };

// const isLong = (s: string) => {
//   return isHex(s) && removeHash(s).length >= 6;
// };

// const hasAlpha = (s: string) => {
//   return isLong(s) && removeHash(s).length > 6;
// };

// const makeShort = (s: string) => {
//   if (isLong(s)) {
//     return addHash(
//       Array.from(removeHash(s))
//         .filter((_, i) => i % 2 === 0)
//         .join('')
//     );
//   }
//   return addHash(s);
// };

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
    .map((char, i, coll) => {
      return i % 2 === 0 ? char + coll[i + 1] : '';
    })
    .filter((v) => v);

  const object: RgbHex = array.reduce((acc, value, i) => {
    const keys = 'rgb';
    const key: string = i === 3 ? 'a' : keys[i];
    // if (value) {
    acc[key as keyof RgbHex] = value;
    // }
    return acc;
  }, {} as RgbHex);

  return {
    array: (): string[] => array,
    object: (): {} => object,
    css: (): string => addHash(hex),
  };
};
