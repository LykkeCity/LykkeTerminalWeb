export const logBase = (x: number, y: number) => Math.log(y) / Math.log(x);

export const precisionRound = (num: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
};

export const precisionCeil = (num: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.ceil(num * factor) / factor;
};

export const precisionFloor = (num: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.floor(num * factor) / factor;
};
