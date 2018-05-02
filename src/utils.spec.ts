import {capitalize, nextSkip} from './utils';
import {toLocaleStringWithAccuracy} from './utils/string';

describe('capitalize', () => {
  it('should capitalize the string given', () => {
    expect(capitalize('fooBaR')).toBe('Foobar');
    expect(capitalize('foo BaR')).toBe('Foo bar');
  });

  it('should return an empty string if empty string was given', () => {
    expect(capitalize('')).toBe('');
  });

  it('should return an empty string if undefined or null was given', () => {
    expect(capitalize(undefined)).toBe('');
    expect(capitalize(null)).toBe('');
  });
});

describe('nextSkip', () => {
  it('should return next skip', () => {
    expect(nextSkip(0, 50, 0)).toBe(50);
    expect(nextSkip(50, 50, 0)).toBe(100);
    expect(nextSkip(50, 0, 0)).toBe(50);
  });

  it('should add sided numbers to the next skip', () => {
    expect(nextSkip(50, 50, 2)).toBe(102);
  });
});

describe('toLocaleStringWithAccuracy', () => {
  it('should not mutate value if accuracy equals target accuracy', () => {
    expect(toLocaleStringWithAccuracy(1.12345, 5)).toBe('1.12345');
    expect(toLocaleStringWithAccuracy(1.12341, 5)).toBe('1.12341');
    expect(toLocaleStringWithAccuracy(1.12349, 5)).toBe('1.12349');
    expect(toLocaleStringWithAccuracy(1, 0)).toBe('1');
  });
});
