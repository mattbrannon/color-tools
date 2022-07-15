const {
  parseHsl,
  utils: { keepHueInRange, keepPercentInRange, getColorSpace },
} = require('../dist/colorTools.cjs');

describe('hsl.js tests', () => {
  describe('getHslValuesFromString, tests', () => {
    it('should return an array of hsl values', () => {
      const result = parseHsl('hsl(120, 100%, 50%)').array();
      expect(result).toEqual([ 120, 100, 50 ]);
    });
  });

  describe('keepHueInRange Test', () => {
    it('should keep the hue between 0 and 360', () => {
      const result = keepHueInRange(480);
      expect(result).toEqual(120);
    });
    it('should keep the hue between 0 and 360', () => {
      const result = keepHueInRange(-480);
      expect(result).toEqual(240);
    });
    it('should not modify the hue when in range', () => {
      const result = keepHueInRange(45);
      expect(result).toEqual(45);
    });
  });
  describe('keepPercentInRange Test', () => {
    it('should keep percentages between 0 and 100', () => {
      const result = keepPercentInRange(120);
      expect(result).toEqual(100);
    });
    it('should keep percentages between 0 and 100', () => {
      const result = keepPercentInRange(-20);
      expect(result).toEqual(0);
    });
    it('should not modify percentages between 0 and 100', () => {
      const result = keepPercentInRange(50);
      expect(result).toEqual(50);
    });
  });
  // describe('stripDegFromHue Test', () => {
  //   it('should return a number', () => {
  //     const result = stripDegFromHue('345deg');
  //     expect(result).to.be.a('number');
  //   });
  //   it('should return the the correct value', () => {
  //     const result = stripDegFromHue('345deg');
  //     expect(result).toEqual(345);
  //   });
  //   it('should work if deg string not present', () => {
  //     const result = stripDegFromHue('345');
  //     expect(result).toEqual(345);
  //   });
  //   it('should work if already a number', () => {
  //     const result = stripDegFromHue(345);
  //     expect(result).toEqual(345);
  //   });
  // });

  describe('parseString Test', () => {
    // it('should parse an hsl string correctly', () => {
    //   const result = parseHsl('hsl(120, 100%, 50%');
    //   expect(result).toEqual({ format: 'hsl', values: [ 120, 100, 50 ] });
    // });
    // it('should return an object with keys `format` and `values`', () => {
    //   const obj = parseHsl('hsl(220, 100, 40');
    //   expect(obj).to.haveOwnProperty('format');
    //   expect(obj).to.haveOwnProperty('values');
    // });
    it('should be hsl format', () => {
      const colorSpace = getColorSpace('hsl(220, 100, 40');
      expect(colorSpace).toEqual('hsl');
    });
    it('should be hsl format', () => {
      const colorSpace = getColorSpace('hsla(220, 100, 40, 0.5');
      expect(colorSpace).toEqual('hsl');
    });
    it('should be an array of numbers', () => {
      const array = parseHsl('hsla(220deg, 100%, 40%, 0.5').array();
      const isNumbers = array.every((value) => typeof value === 'number');
      expect(isNumbers).toEqual(true);
    });
    it('should return the correct array values', () => {
      const array = parseHsl('hsla(220deg, 100%, 40%, 0.5').array();
      expect(array).toEqual([ 220, 100, 40, 0.5 ]);
    });
  });

  describe('toObject Test', () => {
    const str1 = 'hsl(120, 100%, 50%)';
    const str2 = 'hsl(120, 100%, 50%, 0.5)';
    const str3 = 'hsl(120, 100%, 50%, 50%)';
    const str4 = 'hsl(120deg, 100%, 50%)';
    const str5 = 'hsl(120, 100, 50, 0.5)';
    // const str6 = 'hsl(120 100% 50% 50%)';

    const output1 = { h: 120, s: 100, l: 50 };
    const output2 = { h: 120, s: 100, l: 50, a: 0.5 };

    it('should return an hsl object from a string', () => {
      const result = parseHsl(str1).object();
      expect(result).toEqual(output1);
    });
    it('should return an hsl object from a string', () => {
      const result = parseHsl(str2).object();
      expect(result).toEqual(output2);
    });
    it('should return an hsl object from a string', () => {
      const result = parseHsl(str3).object();
      expect(result).toEqual(output2);
    });
    it('should return an hsl object from a string', () => {
      const result = parseHsl(str4).object();
      expect(result).toEqual(output1);
    });
    it('should return an hsl object from a string', () => {
      const result = parseHsl(str5).object();
      expect(result).toEqual(output2);
    });
    // it('should return an hsl object from a string', () => {
    //   const result = parseHsl(str6).object();
    //   expect(result).toEqual(output2);
    // });
  });

  describe('toString Test', () => {
    const input1 = { h: 120, s: 100, l: 50 };
    const input2 = { h: 120, s: 100, l: 50, a: 0.5 };

    const output1 = 'hsl(120deg, 100%, 50%)';
    const output2 = 'hsl(120deg, 100%, 50%, 0.5)';

    it('should return an hsl string from an object', () => {
      const result = parseHsl(input1).css();
      expect(result).toEqual(output1);
    });
    it('should return an hsl string from an object', () => {
      const result = parseHsl(input2).css();
      expect(result).toEqual(output2);
    });
  });

  // describe('parseHSL', () => {
  //   const input = 'hsl(210, 100, 50)';

  //   it('should be an object', () => {
  //     expect(typeof parseHSL(input)).toEqual('object');
  //   });
  //   it('should have an array method', () => {
  //     const parsed = parseHSL(input);
  //     expect(parsed).to.haveOwnProperty('array');
  //   });
  //   it('should have an object method', () => {
  //     const parsed = parseHSL(input);
  //     expect(parsed).to.haveOwnProperty('object');
  //   });
  //   it('should have a css method', () => {
  //     const parsed = parseHSL(input);
  //     expect(parsed).to.haveOwnProperty('css');
  //   });
  //   it('should return an array of hsl values', () => {
  //     const parsed = parseHSL(input);
  //     expect(parsed.array()).toEqual([ 210, 100, 50 ]);
  //   });
  //   it('should return an object of hsl values', () => {
  //     const parsed = parseHSL(input);
  //     expect(parsed.object()).toEqual({ h: 210, s: 100, l: 50 });
  //   });
  //   it('should return a valid hsl css string', () => {
  //     const parsed = parseHSL(input);
  //     expect(parsed.css()).toEqual('hsl(210deg, 100%, 50%)');
  //   });
  // });
});
