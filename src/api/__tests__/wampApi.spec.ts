import {WampApi} from '../wampApi';

const wamp = new WampApi();
let response: [any];

describe('long asynchronous specs', function() {
  beforeEach(() => {
    wamp.connect('wss://wamp.lykke.com/ws/', 'prices').then(() => {
      wamp.subscribe('quote.spot.eurusd.bid', (args: [any]) => {
        response = args;
      });
    });
  });

  it(
    'wamp session should be defined after connection established',
    () => {
      expect(response).toBeDefined();
      expect(response instanceof Array).toBeTruthy();
    },
    5000
  );
});
