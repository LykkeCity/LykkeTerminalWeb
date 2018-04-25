export function formattedNumber(
  value: any,
  accuracy?: number,
  options?: any
): string {
  const indexOfPoint = (value + '').search(/\./);
  const countOfFractionPoints = (value + '').length - indexOfPoint - 1;

  if (typeof value === 'string') {
    accuracy = !accuracy ? countOfFractionPoints : accuracy;
    value = +value;
  }

  if (indexOfPoint === -1) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    });
  }

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
}
