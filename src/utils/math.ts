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

export const minOrMaxFromList = (list: number[], type: 'min' | 'max') =>
  Math[type](...list);

export const decimalAdjust = (type: string, value: any, exp: number) => {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
};

export const truncate = (num: number, places: number) => {
  const numPower = Math.pow(10, places);
  return Math.floor(num * numPower) / numPower;
};
