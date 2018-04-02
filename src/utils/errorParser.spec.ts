import ErrorParser from './errorParser';

describe('string utils', () => {
  it('should return splitted string', () => {
    const message = 'ReservedVolumeHigherThanBalance';
    expect(ErrorParser.getMessage(message)).toBe(
      'reserved volume higher than balance'
    );
  });
});
