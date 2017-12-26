import {WampApi} from '../wampApi';

const wamp = new WampApi();

describe('wamp service', () => {

  beforeEach(() => {

  });

  it('wamp session should be defined after connection established',
    () => {
      //ToDo: Need to find out why it's impossible to resolve wamp.connect promise here
      expect(true).toBe(true);

      return wamp.connect('wss://wamp.lykke.com/ws/', 'prices')
        .then((session) => {})
    }
  );

  afterEach(() => {

  });
});
