import {
  getPostDecimalsLength,
  getWampErrorMessage,
  isOnlyNumbers,
  substringLast,
  substringMinus,
  substringZero,
  getRestErrorMessage
} from './string';

describe('string utils', () => {
  it('should return the length of post decimals numbers', () => {
    const customNumber = '123.123';
    const postDecimalLength = customNumber.split('.')[1].length;
    expect(getPostDecimalsLength(customNumber)).toBe(postDecimalLength);
  });

  it('should return 0 if there is no post decimals', () => {
    const customNumber = '123';
    expect(getPostDecimalsLength(customNumber)).toBe(0);
  });

  it('should return string without leading 0', () => {
    const customNumber = '02';
    expect(substringZero(customNumber)).toBe('2');
  });

  it('should return string without leading 0', () => {
    const customNumber = '02';
    expect(substringZero(customNumber)).toBe('2');
  });

  it('should return the same string', () => {
    const customNumber = '0.2';
    expect(substringZero(customNumber)).toBe(customNumber);
    const customNumber2 = '2';
    expect(substringZero(customNumber2)).toBe(customNumber2);
  });

  it('should substring last symbol', () => {
    const customNumber = '0.23';
    const subStr = customNumber.substring(0, customNumber.length - 1);
    expect(substringLast(customNumber)).toBe(subStr);
  });

  it('should return true for for only numbers value', () => {
    const customNumber = '0.23';
    expect(isOnlyNumbers(customNumber)).toBe(true);
  });

  it('should return true for for not only numbers value', () => {
    const customNumber = '0.23x';
    expect(isOnlyNumbers(customNumber)).toBe(false);
  });

  it('should substring minus from string', () => {
    const customNumber = '-0.2';
    const returned = substringMinus(customNumber);
    expect(substringZero(returned)).toBe(customNumber.substring(1));
  });

  it('should return splitted string', () => {
    const message = 'ReservedVolumeHigherThanBalance';
    expect(getWampErrorMessage(message)).toBe(
      'reserved volume higher than balance'
    );
  });

  it('shoud return string from rest error object', () => {
    const restMessage = {id: ['Value to small', 'Please, try again']};
    expect(getRestErrorMessage(restMessage)).toBe(
      'Value to small. Please, try again'
    );
  });
});
