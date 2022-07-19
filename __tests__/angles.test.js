const { gradian, radian, degree, turn } = require('../src/angles');

const methods = [ 'toRadian', 'toGradian', 'toTurn', 'toDegree' ];

describe('angle conversions', () => {
  [ gradian, radian, degree, turn ].forEach((fn) => {
    describe(fn.name, () => {
      methods.forEach((method) => {
        describe(`${fn.name} ${method}`, () => {
          const blah = fn(270);
          it('should exist', () => {
            expect(blah[method]).toBeDefined();
          });
        });
      });
    });
  });
});
