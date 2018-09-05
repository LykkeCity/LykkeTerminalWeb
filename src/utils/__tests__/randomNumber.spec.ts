import randomNumber from '../randomNumber';

describe('method randomNumber', () => {
  it('should return same hashcodes for same objects', () => {
    const num = randomNumber(1, 10);
    expect(num >= 1 && num <= 10).toBeTruthy();
  });
});
