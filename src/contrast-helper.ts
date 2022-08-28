import { Color } from './color';
import { PreferedColorSpace } from './interfaces';

type ColorInput = string | Color;

const getOrCreateInstance = (color: ColorInput) => {
  color = color instanceof Color ? color : new Color(color);
  return color;
};

export const getTintsOrShades = (color: Color, accent: Color) => {
  const shadeRatio = Color.contrast('black', accent);
  const tintRatio = Color.contrast('white', accent);
  const array = shadeRatio > tintRatio ? color.shades() : color.tints();
  return array;
};

const LOW = 3.0;
const MID = 4.5;
const HIGH = 7.0;

export const suggest = (main: ColorInput) => (variant: ColorInput) => {
  main = getOrCreateInstance(main);
  variant = getOrCreateInstance(variant);

  let ratio = main.contrast(variant);
  const hsl = main.hsl.object();
  const { h, s } = hsl;
  let l1 = hsl.l;
  let lighter;
  let darker;

  while (l1 < 100 && ratio < HIGH) {
    l1 += 1;
    lighter = new Color({ h, s, l: l1 });
    ratio = lighter.contrast(variant);
  }

  let l2 = hsl.l;

  while (l2 > 0 && ratio < HIGH) {
    l2 -= 1;
    darker = new Color({ h, s, l: l2 });
    ratio = darker.contrast(variant);
  }

  return { lighter, darker };
};

export const setOutput = (color: Color, colorSpace: PreferedColorSpace) =>
  color[colorSpace].css();

export const getCurrentLevels = (ratio: number) => ({
  low: ratio >= LOW,
  avg: ratio >= MID,
  high: ratio >= HIGH,
});

// type Alternative = string[];

// export const getVariants = (
//   color: ColorInput,
//   accent: ColorInput,
//   colorSpace: PreferedColorSpace = 'hex'
// ) => {
//   color = getOrCreateInstance(color);
//   accent = getOrCreateInstance(accent);

//   const variants = {
//     control: setOutput(color, colorSpace),
//     current: setOutput(accent, colorSpace),
//     alternatives: [] as Alternative,
//   };

//   const ratio = color.contrast(accent);
//   const levels = getCurrentLevels(ratio);
//   const array = getTintsOrShades(color, accent);

//   for (let i = 0; i < array.length; i++) {
//     const variant = array[i];
//     const color = new Color(variant);
//     const contrastRatio = Color.contrast(color, accent);
//     if (contrastRatio >= LOW && !levels.low) {
//       levels.low = true;
//       const option1 = setOutput(color, colorSpace);
//       const option2 = setOutput(accent, colorSpace);

//       variants.alternatives.push({ option1, option2 });

//       // variants.alternatives.push({
//       //   color: [],
//       //   contrastRatio,
//       // });
//     }
//     if (contrastRatio >= MID && !levels.avg) {
//       levels.avg = true;
//       variants.alternatives.push({
//         color: [ setOutput(color, colorSpace), setOutput(accent, colorSpace) ],
//         contrastRatio,
//       });
//     }
//     if (contrastRatio >= HIGH && !levels.high) {
//       levels.high = true;
//       variants.alternatives.push({
//         color: [ setOutput(color, colorSpace), setOutput(accent, colorSpace) ],
//         contrastRatio,
//       });
//       break;
//     }
//   }
//   return variants;
// };
