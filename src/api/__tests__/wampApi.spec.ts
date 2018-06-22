import {WampApi} from '../wampApi';

describe('wamp service', () => {
  let wamp: WampApi;

  describe('wamp', () => {
    beforeEach(() => {
      wamp = new WampApi();
      wamp.throttle = jest.fn();
    });

    it('session should be defined after connection established', async () => {
      expect(wamp.connect).toBeDefined();
      const connection = wamp.connect('', '');
      expect(connection).toBeDefined();
      expect(connection).toBeInstanceOf(Promise);
    });

    describe('pausing', () => {
      it('should throttle the connection closing', () => {
        wamp.connect('', '');
        wamp.pause();
        expect(wamp.throttle).toBeDefined();
        expect(wamp.throttle).toBeCalled();
      });

      it('should not throttle the connection closing', () => {
        wamp.connect('', '');
        wamp.isThrottled = true;
        wamp.pause();
        expect(wamp.throttle).not.toBeCalled();
      });
    });
  });
});
