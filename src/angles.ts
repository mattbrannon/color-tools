export const radianToDegree = (rad: number) => {
  return Math.round(rad * (180 / Math.PI) * 100) / 100;
};

export const radianToTurn = (rad: number) => {
  return Math.round((rad / (Math.PI * 2)) * 10000) / 10000;
};

export const radianToGradian = (rad: number) => {
  return Math.round(rad * (200 / Math.PI) * 100) / 100;
};

export const degreeToRadian = (deg: number) => {
  return Math.round(deg * (Math.PI / 180) * 10000) / 10000;
};

export const degreeToTurn = (deg: number) => {
  return Math.round((deg / 360) * 10000) / 10000;
};

export const degreeToGradian = (deg: number) => {
  const rad = degreeToRadian(deg);
  return radianToGradian(rad);
};

export const turnToRadian = (turn: number) => {
  return Math.round(turn * (Math.PI * 2) * 10000) / 10000;
};

export const turnToDegree = (turn: number) => {
  return Math.round(turn * 360 * 10000) / 10000;
};

export const turnToGradian = (turn: number) => {
  const rad = turnToRadian(turn);
  return radianToGradian(rad);
};

export const gradianToRadian = (grad: number) => {
  return Math.round(grad * (Math.PI / 200) * 10000) / 10000;
};

export const gradianToDegree = (grad: number) => {
  const rad = gradianToRadian(grad);
  return radianToDegree(rad);
};

export const gradianToTurn = (grad: number) => {
  const rad = gradianToRadian(grad);
  return radianToTurn(rad);
};

export const identity = (n: any) => Number(n);

export const gradian = {
  toDegree: (n: number) => gradianToDegree(n),
  toRadian: (n: number) => gradianToRadian(n),
  toTurn: (n: number) => gradianToTurn(n),
  toGradian: (n: number) => identity(n),
};

export const radian = {
  toDegree: (n: number) => radianToDegree(n),
  toGradian: (n: number) => radianToGradian(n),
  toTurn: (n: number) => radianToTurn(n),
  toRadian: (n: number) => identity(n),
};

export const degree = {
  toRadian: (n: number) => degreeToRadian(n),
  toGradian: (n: number) => degreeToGradian(n),
  toTurn: (n: number) => degreeToTurn(n),
  toDegree: (n: number) => identity(n),
};

export const turn = {
  toRadian: (n: number) => turnToRadian(n),
  toGradian: (n: number) => turnToGradian(n),
  toDegree: (n: number) => turnToDegree(n),
  toTurn: (n: number) => identity(n),
};
