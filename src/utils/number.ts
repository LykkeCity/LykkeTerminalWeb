const START_EXPONENT = 1e-7;

export const getDigits = (x: number) => {
  if (x <= START_EXPONENT) {
    const splittedNumber = x.toString().split('-');
    return Number(splittedNumber[splittedNumber.length - 1]);
  }
  return x.toString().includes('.')
    ? x
        .toString()
        .split('.')
        .pop()!.length
    : 0;
};
