import { isHex, removeHash, addHash } from './utils';
import { ColorObject } from './interfaces';

const isShort = (s: string) => {
  return isHex(s) && removeHash(s).length <= 4;
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
    .map((char, i, coll) => {
      return i % 2 === 0 ? char + coll[i + 1] : '';
    })
    .filter((v) => v);

  const object = array.reduce((acc: ColorObject, value, i) => {
    const keys = 'rgb';
    const key: string = i === 3 ? 'a' : keys[i];
    acc[key as keyof ColorObject] = value;
    return acc;
  }, {});

  return {
    array: (): string[] => array,
    object: (): {} => object,
    css: (): string => addHash(hex),
  };
};
