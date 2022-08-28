const {
  gradian,
  radian,
  degree,
  turn,
  // radianToDegree,
  // radianToGradian,
  // radianToTurn,
  // gradianToDegree,
  // gradianToRadian,
  // gradianToTurn,
  // degreeToGradian,
  // degreeToRadian,
  // degreeToTurn,
  // turnToDegree,
  // turnToGradian,
  // turnToRadian,
} = require('../src/angles');

// const methods = [
//   radianToDegree,
//   radianToGradian,
//   radianToTurn,
//   gradianToDegree,
//   gradianToRadian,
//   gradianToTurn,
//   degreeToGradian,
//   degreeToRadian,
//   degreeToTurn,
//   turnToDegree,
//   turnToGradian,
//   turnToRadian,
// ];

const values = {
  degree: 270,
  radian: 4.7124,
  gradian: 300,
  turn: 0.75,
};

// gradian.toDegree(values.gradian)

describe('Angle conversions', () => {
  // const objects = [{ degree }, { radian }, { turn }, { gradian }];
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
    //   test('gradian', () => {
    //     // expect(gradianToDegree(values.gradian)).toEqual(values.degree);
    //     expect(gradian.toDegree(values.gradian)).toEqual(values.degree);
    //     expect(gradian.toRadian(values.gradian)).toEqual(values.radian);
    //     expect(gradian.toTurn(values.gradian)).toEqual(values.turn);
    //     expect(gradian.toGradian(values.gradian)).toEqual(values.gradian);
    //   });
    //   test('radian', () => {
    //     // expect(radianToDegree(values.radian)).toEqual(values.degree);
    //     expect(radian.toDegree(values.radian)).toEqual(values.degree);
    //     expect(radian.toRadian(values.radian)).toEqual(values.radian);
    //     expect(radian.toTurn(values.radian)).toEqual(values.turn);
    //     expect(radian.toGradian(values.radian)).toEqual(values.gradian);
    //   });
    //   test('degree', () => {
    //     expect(degree.toDegree(values.degree)).toEqual(values.degree);
    //     expect(degree.toRadian(values.degree)).toEqual(values.radian);
    //     expect(degree.toTurn(values.degree)).toEqual(values.turn);
    //     expect(degree.toGradian(values.degree)).toEqual(values.gradian);
    //   });
    //   test('turn', () => {
    //     expect(turn.toDegree(values.turn)).toEqual(values.degree);
    //     expect(turn.toRadian(values.turn)).toEqual(values.radian);
    //     expect(turn.toTurn(values.turn)).toEqual(values.turn);
    //     expect(turn.toGradian(values.turn)).toEqual(values.gradian);
    //   });
    // });
    // describe('Singletons', () => {
    //   Object.entries(values).forEach(([ outputType, value ]) => {
    //     describe(`${outputType} methods`, () => {
    //       methods
    //         .filter((method) => {
    //           return method.name.toLowerCase().includes(`to${outputType}`);
    //         })
    //         .forEach((method) => {
    //           describe(`${method.name} -> ${outputType}`, () => {
    //             test('it converts correctly', () => {
    //               const inputType = method.name.slice(
    //                 0,
    //                 method.name.indexOf('To')
    //               );
    //               const input = values[inputType];
    //               const output = values[outputType];
    //               expect(method(input)).toEqual(output);
    //             });
    //           });
    //         });
    //     });
    //   });
  });
});
