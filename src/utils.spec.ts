import {capitalize} from './utils';

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
