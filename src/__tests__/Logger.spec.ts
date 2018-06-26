import logger from '../Logger';

describe('logException', () => {
  it('should be called on exception', () => {
    try {
      window.dispatchEvent(new Event('error'));
    } catch {
      expect(logger.logException).toHaveBeenCalledTimes(1);
    }
  });
});
