export const formattedNumber = (
  value: number,
  accuracy: number,
  options?: object
): string => {
  if (accuracy) {
    options = {
      minimumFractionDigits: accuracy,
      maximumFractionDigits: accuracy,
      ...options
    };
  }

  let result = value.toLocaleString(undefined, options);
  const indexOfZero = result.search(/0+$/);
  result = indexOfZero !== -1 ? result.slice(0, indexOfZero + 1) : result + '0';

  return result;
};
