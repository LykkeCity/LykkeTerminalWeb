import ArrowDirection from '../models/arrowDirection';
import {addition, subtraction} from '../utils/math';
import {
  getPostDecimalsLength,
  isOnlyNumbers,
  substringDot,
  substringLastSome,
  substringMinus,
  substringZero
} from './string';

export const DEFAULT_INPUT_VALUE = '';

export const onArrowClick = (
  getValue: () => string,
  getAccuracy: () => number,
  setValue: (value: number | string) => void,
  operation: ArrowDirection
) => {
  const value = !getValue() ? '0' : getValue();
  switch (operation) {
    case ArrowDirection.Up:
      setValue(addition(value, Math.pow(10, -1 * getAccuracy())).toString());
      break;
    case ArrowDirection.Down:
      const newVal = subtraction(value, Math.pow(10, -1 * getAccuracy()));
      const sentVal = newVal.toNumber() <= 0 ? 0 : newVal.toString();
      setValue(sentVal);
      break;
  }
};

export const onValueChange = (
  setValue: (value: number | string) => void,
  getAccuracy: () => number,
  value: string
) => {
  if (!isOnlyNumbers(value)) {
    return;
  }
  value = substringZero(value);
  value = substringMinus(value);
  if (getAccuracy() === 0) {
    value = substringDot(value);
  }

  if (getPostDecimalsLength(value) > getAccuracy()) {
    value = substringLastSome(
      value,
      getPostDecimalsLength(value) - getAccuracy()
    );
  }
  const newVal = value === DEFAULT_INPUT_VALUE ? DEFAULT_INPUT_VALUE : value;
  setValue(newVal);
};

export const addThousandSeparator = (value: string) => {
  const thousandSeparatorRegex = /(\d+)(\d{3})/;
  const numberParts = value.split('.');
  let integerPart = numberParts[0];
  const decimalPart = numberParts.length > 1 ? '.' + numberParts[1] : '';
  while (thousandSeparatorRegex.test(integerPart)) {
    integerPart = integerPart.replace(
      thousandSeparatorRegex,
      '$1' + ',' + '$2'
    );
  }
  return integerPart + decimalPart;
};
