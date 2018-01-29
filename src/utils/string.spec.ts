import StringHelpers from './string';

describe('string utils', () => {
  it('should return the length of post decimals numbers', () => {
    const customNumber = '123.123';
    const postDecimalLength = customNumber.split('.')[1].length;
    expect(StringHelpers.getPostDecimalsLength(customNumber)).toBe(
      postDecimalLength
    );
  });

  it('should return 0 if there is no post decimals', () => {
    const customNumber = '123';
    expect(StringHelpers.getPostDecimalsLength(customNumber)).toBe(0);
  });

  it('should return string without leading 0', () => {
    const customNumber = '02';
    expect(StringHelpers.substringZero(customNumber)).toBe('2');
  });

  it('should return string without leading 0', () => {
    const customNumber = '02';
    expect(StringHelpers.substringZero(customNumber)).toBe('2');
  });

  it('should return the same string', () => {
    const customNumber = '0.2';
    expect(StringHelpers.substringZero(customNumber)).toBe(customNumber);
    const customNumber2 = '2';
    expect(StringHelpers.substringZero(customNumber2)).toBe(customNumber2);
  });

  it('should substring last symbol', () => {
    const customNumber = '0.23';
    const subStr = customNumber.substring(0, customNumber.length - 1);
    expect(StringHelpers.substringLast(customNumber)).toBe(subStr);
  });
});
