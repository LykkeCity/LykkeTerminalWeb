// tslint:disable-next-line:no-var-requires
const Big = require('big.js');

export const logBase = (x: number, y: number) => Math.log(y) / Math.log(x);

export const precisionRound = (num: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
};

export const precisionCeil = (num: number, precision: number) => {
  num = Number.isFinite(num) ? num : 0;
  const factor = Math.pow(10, precision);
  return Math.ceil(new Big(num).times(factor).valueOf()) / factor;
};

export const precisionFloor = (num: number, precision: number) => {
  num = Number.isFinite(num) ? num : 0;
  const factor = Math.pow(10, precision);
  return Math.floor(new Big(num).times(factor).valueOf()) / factor;
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

export const getPercentsOf = (
  percents: number,
  value: number,
  accuracy: number
) => precisionFloor(percents / 100 * value, accuracy);

export const addition = (term1: number | string, term2: number | string) => {
  return new Big(term1).plus(term2).valueOf();
};

export const subtraction = (
  value: number | string,
  decrement: number | string
) => {
  return new Big(value).minus(decrement).valueOf();
};

export const bigToFixed = (
  value: number | string,
  accuracy: number | string
) => {
  return new Big(value).toFixed(accuracy);
};
