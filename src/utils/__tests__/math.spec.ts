import {getPercentsOf, precisionCeil, precisionFloor} from '../math';

describe('Test math functions', () => {
  it('should cut number with precision without rounding', () => {
    let precision = 2;
    let num = 9780.47;
    expect(precisionFloor(num, precision)).toBe(num);

    precision = 4;
    num = 9780.475869985;
    expect(precisionFloor(num, precision)).toBe(9780.4758);
  });

  it('should cut number and increase last digit', () => {
    let precision = 4;
    let num = 9780.475869985;
    expect(precisionCeil(num, precision)).toBe(9780.4759);

    precision = 2;
    num = 9780.474;
    expect(precisionCeil(num, precision)).toBe(9780.48);
  });

  it('should calculate percents of value', () => {
    const percents = 20;
    const value = 100;
    const accuracy = 0;
    expect(getPercentsOf(percents, value, accuracy)).toBe(20);
  });
});
