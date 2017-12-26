import {WampApi} from '../wampApi';

const wamp = new WampApi();

describe('wamp service', () => {
  beforeEach(function() {});

  it('testing connect 2', () => {
    expect.assertions(1);
    return wamp.connect2().then(session => expect(session).toBeDefined());
  });

  it('wamp session should be defined after connection established', () => {
    expect.assertions(1);
    return wamp
      .connect('wss://wamp.lykke.com/ws/', 'prices')
      .then(session => expect(session).toBeDefined());
  });

  afterEach(function() {});
});
