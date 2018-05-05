import {throwPastParam} from '../fn';

const replaceNumber = (replacer: any) => (
  value: number,
  accuracy: number,
  options?: object
) => {
  options = {
    minimumFractionDigits: accuracy,
    maximumFractionDigits: accuracy,
    ...options
  };

  if (!Number.isFinite(value)) {
    if (typeof replacer === 'string') {
      return replacer;
    }
    value = replacer;
  }

  const result = value.toLocaleString(undefined, options);
  return checkForTrailingZero(result);
};

export const formattedNumber = throwPastParam(0, replaceNumber);
export const formattedNumberWithDashes = throwPastParam('--', replaceNumber);

export const checkForTrailingZero = (value: string): string => {
  const indexOfZero = value.search(/0+$/);
  const zeroesQuantity =
    value[indexOfZero - 1] === ',' || value[indexOfZero - 1] === '.' ? 2 : 1;
  return indexOfZero !== -1
    ? value.slice(0, indexOfZero + zeroesQuantity)
    : value;
};

export default formattedNumber;
