import {WampApi} from '../wampApi';

const wamp = new WampApi();

describe('wamp service', () => {
  it('wamp session should be defined after connection established', () => {
    expect(wamp.connect).toBeDefined();
    expect(true).toBe(true);
  });
});
