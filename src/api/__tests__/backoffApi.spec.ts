import {Backoff, createBackoff} from '../backoffApi';

describe('backoffApi', () => {
  const onReady = jest.fn();

  describe('method createBackoff', () => {
    it('should create new backoff instance', () => {
      const result = createBackoff(onReady);
      expect(result).toBeInstanceOf(Backoff);
      expect(result.backoff).toBeDefined();
    });
  });

  describe('method backoff', () => {
    it('should set timeout', () => {
      jest.useFakeTimers();
      const backoff = createBackoff(onReady);
      backoff.backoff();
      expect(setTimeout).toHaveBeenCalledTimes(1);
    });
  });
});
