import Color from '../main.js';
import { LOW, AVG, HIGH } from '../constants/contrast-ratios.js';

const createColorInstance = (input) => {
  return input instanceof Color ? input : new Color(input);
};

const getCurrentLevels = (ratio) => {
  return { low: ratio >= LOW, avg: ratio >= AVG, high: ratio >= HIGH };
};

const getTintsOrShades = (color, accent) => {
  const shadeRatio = Color.contrast('black', accent);
  const tintRatio = Color.contrast('white', accent);
  const lightness = color.hsl.object().l;
  const array = shadeRatio > tintRatio ? color.shades(lightness) : color.tints(lightness);
  return array;
};

const setOutput = (color, colorSpace = 'hex') => {
  return colorSpace === 'hex' ? color.hex : color[colorSpace].css();
};

export const getVariants = (color, accent, colorSpace) => {
  color = createColorInstance(color);
  accent = createColorInstance(accent);

  const variants = {
    control: setOutput(color, colorSpace),
    current: setOutput(accent, colorSpace),
    alternatives: [],
  };

  const ratio = color.contrast(accent);
  const levels = getCurrentLevels(ratio);
  const array = getTintsOrShades(color, accent);

  for (let i = 0; i < array.length; i++) {
    const variant = array[i];
    const color = new Color(variant);
    const contrastRatio = Color.contrast(color, accent);
    if (contrastRatio >= LOW && !levels.low) {
      levels.low = true;
      variants.alternatives.push({
        color: [ setOutput(color, colorSpace), setOutput(accent, colorSpace) ],
        contrastRatio,
      });
    }
    if (contrastRatio >= AVG && !levels.avg) {
      levels.avg = true;
      variants.alternatives.push({
        color: [ setOutput(color, colorSpace), setOutput(accent, colorSpace) ],
        contrastRatio,
      });
    }
    if (contrastRatio >= HIGH && !levels.high) {
      levels.high = true;
      variants.alternatives.push({
        color: [ setOutput(color, colorSpace), setOutput(accent, colorSpace) ],
        contrastRatio,
      });
      break;
    }
  }
  return variants;
};

export const testContrast = (color1, color2) => {
  color1 = createColorInstance(color1);
  color2 = createColorInstance(color2);
  color1.compare(color2);
};
