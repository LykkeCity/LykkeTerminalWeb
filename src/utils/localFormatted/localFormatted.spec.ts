import {checkForTrailingZero} from './localFormatted';

describe('Test locale for number and date', () => {
  it('should return string number with locale', () => {
    expect(checkForTrailingZero('50000,05000')).toBe('50000,050');
    expect(checkForTrailingZero('50000,050004')).toBe('50000,050004');
    expect(checkForTrailingZero('50000,0000')).toBe('50000,00');
    expect(checkForTrailingZero('50000,1000')).toBe('50000,10');

    expect(checkForTrailingZero('50000.05000')).toBe('50000.050');
    expect(checkForTrailingZero('50000.050004')).toBe('50000.050004');
    expect(checkForTrailingZero('50000.0000')).toBe('50000.00');
    expect(checkForTrailingZero('50000.1000')).toBe('50000.10');
  });
});
