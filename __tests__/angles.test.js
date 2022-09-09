const { gradian, radian, degree, turn } = require('../src/angles');

const values = {
  degree: 270,
  radian: 4.7124,
  gradian: 300,
  turn: 0.75,
};

describe('Angle conversions', () => {
  describe('Methods', () => {
    [{ degree }, { radian }, { turn }, { gradian }].forEach((object) => {
      const root = Object.keys(object).join('');
      describe(root, () => {
        const methods = object[root];
        const n = values[root];
        test(`${root} to degree`, () => {
          expect(methods.toDegree(n)).toEqual(values.degree);
        });
        test(`${root} to radian`, () => {
          expect(methods.toRadian(n)).toEqual(values.radian);
        });
        test(`${root} to turn`, () => {
          expect(methods.toTurn(n)).toEqual(values.turn);
        });
        test(`${root} to gradian`, () => {
          expect(methods.toGradian(n)).toEqual(values.gradian);
        });
      });
    });
  });
});
