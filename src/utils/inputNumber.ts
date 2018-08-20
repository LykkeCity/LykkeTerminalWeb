import {safeMath} from '@lykkex/lykke.js';
import ArrowDirection from '../models/arrowDirection';
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
      setValue(
        safeMath.add(value, Math.pow(10, -1 * getAccuracy())).toString()
      );
      break;
    case ArrowDirection.Down:
      const newVal = safeMath.sub(value, Math.pow(10, -1 * getAccuracy()));
      const sentVal = newVal.valueOf() <= 0 ? 0 : newVal.toString();
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
