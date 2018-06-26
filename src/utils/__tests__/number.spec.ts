import {getDigits} from '../number';

describe('number', () => {
  it('should return number of digits after point', () => {
    const x = 0.0001;
    expect(getDigits(x)).toBe(4);
  });

  it('should return for exponent numbers', () => {
    const x = 1e-7;
    expect(getDigits(x)).toBe(7);
  });
});
