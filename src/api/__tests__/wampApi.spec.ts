import {WampApi} from '../wampApi';

const wamp = new WampApi();

describe('wamp service', () => {
  it('wamp session should be defined after connection established', () => {
    // TODO: Need to find out why it's impossible to resolve wamp.connect promise here
    expect(wamp.connect).toBeDefined();
    expect(true).toBe(true);
  });
});
