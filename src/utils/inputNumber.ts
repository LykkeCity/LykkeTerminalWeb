import ArrowDirection from '../models/arrowDirection';
import {
  getPostDecimalsLength,
  isOnlyNumbers,
  substringLast,
  substringMinus,
  substringZero
} from './string';

export const onArrowClick = (
  getValue: () => string,
  getAcc: () => number,
  setValue: (value: number) => void,
  operation: ArrowDirection
) => {
  const value = getValue();
  switch (operation) {
    case ArrowDirection.Up:
      setValue(parseFloat(value) + Math.pow(10, -1 * getAcc()));
      break;
    case ArrowDirection.Down:
      const newVal = parseFloat(value) - Math.pow(10, -1 * getAcc());
      const sentVal = newVal < 0 ? 0 : newVal;
      setValue(sentVal);
      break;
  }
};

export const onValueChange = (setValue: any, getAcc: any, value: string) => {
  if (!isOnlyNumbers(value)) {
    return;
  }
  value = substringZero(value);
  value = substringMinus(value);

  if (getPostDecimalsLength(value) > getAcc()) {
    value = substringLast(value);
  }
  const newVal = value === '' ? '0' : value;
  setValue(newVal);
};
