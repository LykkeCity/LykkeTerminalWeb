export const formattedNumber = (
  value: number,
  accuracy: number,
  options?: object
): string => {
  options = {
    minimumFractionDigits: accuracy,
    maximumFractionDigits: accuracy,
    ...options
  };

  const result = value.toLocaleString(undefined, options);
  return checkForTrailingZero(result);
};

export const checkForTrailingZero = (value: string): string => {
  const indexOfZero = value.search(/0+$/);
  const zeroesQuantity =
    value[indexOfZero - 1] === ',' || value[indexOfZero - 1] === '.' ? 2 : 1;
  return indexOfZero !== -1
    ? value.slice(0, indexOfZero + zeroesQuantity)
    : value;
};

export default formattedNumber;
