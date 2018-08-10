import {getHashCode} from '../hashcode';

describe('method getHashCode', () => {
  it('should return same hashcodes for same objects', () => {
    const firstHashCode = getHashCode({a: 1});
    const secondHashCode = getHashCode({a: 1});
    expect(firstHashCode).toEqual(secondHashCode);
  });

  it('should return unique hashcodes for different objects', () => {
    const firstHashCode = getHashCode({a: 1});
    const secondHashCode = getHashCode({a: 2});
    expect(firstHashCode).not.toEqual(secondHashCode);
  });
});
