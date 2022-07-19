export const radianToDegree = (rad: number) => {
  return Math.round(rad * (180 / Math.PI) * 10000) / 10000;
};

const radianToTurn = (rad: number) => {
  return Math.round((rad / (Math.PI * 2)) * 10000) / 10000;
};

const radianToGradian = (rad: number) => {
  return Math.round(rad * (200 / Math.PI) * 10000) / 10000;
};

const degreeToRadian = (deg: number) => {
  return Math.round(deg * (Math.PI / 180) * 10000) / 10000;
};

const degreeToTurn = (deg: number) => {
  return Math.round((deg / 360) * 10000) / 10000;
};

const degreeToGradian = (deg: any) => {
  const rad = degreeToRadian(deg);
  return radianToGradian(rad);
};

const turnToRadian = (turn: number) => {
  return Math.round(turn * (Math.PI * 2) * 10000) / 10000;
};

export const turnToDegree = (turn: number) => {
  return Math.round(turn * 360 * 10000) / 10000;
};

const turnToGradian = (turn: any) => {
  const rad = turnToRadian(turn);
  return radianToGradian(rad);
};

const gradianToRadian = (grad: number) => {
  return Math.round(grad * (Math.PI / 200) * 10000) / 10000;
};

export const gradianToDegree = (grad: any) => {
  const rad = gradianToRadian(grad);
  return radianToDegree(rad);
};

const gradianToTurn = (grad: any) => {
  const rad = gradianToRadian(grad);
  return radianToTurn(rad);
};

export const identity = (n: any) => n;

export const angle = {
  gradianToDegree,
  gradianToRadian,
  gradianToTurn,
  radianToDegree,
  radianToGradian,
  radianToTurn,
  degreeToRadian,
  degreeToGradian,
  degreeToTurn,
  turnToRadian,
  turnToGradian,
  turnToDegree,
  identity,
};

export const gradian = (n: number) => {
  return {
    toDegree: gradianToDegree(n),
    toRadian: gradianToRadian(n),
    toTurn: gradianToTurn(n),
    toGradian: identity(n)
  };
};

export const radian = (n: number) => {
  return {
    toDegree: radianToDegree(n),
    toGradian: radianToGradian(n),
    toTurn: radianToTurn(n),
    toRadian: identity(n),
  };
};

export const degree = (n: number) => {
  return {
    toRadian: degreeToRadian(n),
    toGradian: degreeToGradian(n),
    toTurn: degreeToTurn(n),
    toDegree: identity(n)
  };
};

export const turn = (n: number) => {
  return {
    toRadian: turnToRadian(n),
    toGradian: turnToGradian(n),
    toDegree: turnToDegree(n),
    toTurn: identity(n)
  };
};

// export class Angle {
//   constructor() {
//     return {
//       gradian: {
//         toDegree(n: number) {
//           return gradianToDegree(n);
//         },
//         toRadian(n: number) {
//           return gradianToRadian(n);
//         },
//         toTurn(n: number) {
//           return gradianToTurn(n);
//         },
//       },
//       radian: {
//         toDegree(n: number) {
//           return radianToDegree(n);
//         },
//         toGradian(n: number) {
//           return radianToGradian(n);
//         },
//         toTurn(n: number) {
//           return radianToTurn(n);
//         },
//       },
//       degree: {
//         toRadian(n: number) {
//           return degreeToRadian(n);
//         },
//         toGradian(n: number) {
//           return degreeToGradian(n);
//         },
//         toTurn(n: number) {
//           return degreeToTurn(n);
//         },
//       },
//       turn: {
//         toRadian(n: number) {
//           return turnToRadian(n);
//         },
//         toGradian(n: number) {
//           return turnToGradian(n);
//         },
//         toDegree(n: number) {
//           return turnToDegree(n);
//         },
//       },
//     };
//   }
// }
