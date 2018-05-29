import ArrowDirection from '../../models/arrowDirection';
import {onArrowClick, onValueChange} from '../inputNumber';
import {substringLast, substringZero} from '../string';

describe('input with type number functionality', () => {
  const accuracy = 8;
  let customNumber = 1;
  let getValue = () => customNumber.toFixed(accuracy);
  const getAccuracy = () => accuracy;
  let result: any;

  it('should increase value with one digit', () => {
    onArrowClick(
      getValue,
      getAccuracy,
      (value: number) => (result = value),
      ArrowDirection.Up
    );
    expect(result).toBe(customNumber + Math.pow(10, -1 * accuracy));
  });

  it('should decrease value with one digit', () => {
    onArrowClick(
      getValue,
      getAccuracy,
      (value: number) => (result = value),
      ArrowDirection.Down
    );
    expect(result).toBe(customNumber - Math.pow(10, -1 * accuracy));
  });

  it('should return zero if value is zero and arrow direction is down', () => {
    customNumber = 0;
    getValue = () => customNumber.toFixed(accuracy);
    onArrowClick(
      getValue,
      getAccuracy,
      (value: number) => (result = value),
      ArrowDirection.Down
    );
    expect(result).toBe(0);
  });

  it('should set custom value', () => {
    const customValue = '0.258';
    onValueChange(
      (value: string) => (result = value),
      getAccuracy,
      customValue
    );
    expect(result).toBe(customValue);
  });

  it('should cut last digit if digits length greater than accuracy', () => {
    const customValue = '0.123456789';
    onValueChange(
      (value: string) => (result = value),
      getAccuracy,
      customValue
    );
    expect(result).toBe(substringLast(customValue));
  });

  it('should return without odd zeroes before delimiter', () => {
    const customValue = '00.123';
    onValueChange(
      (value: string) => (result = value),
      getAccuracy,
      customValue
    );
    expect(result).toBe(substringZero(customValue));
  });

  it('should not set a value if value contains not only numbers', () => {
    const customValue = 'adasda';
    let notSetValue = 'someValue';
    onValueChange(
      (value: string) => (notSetValue = value),
      getAccuracy,
      customValue
    );
    expect(notSetValue).not.toBe(customValue);
  });
});
