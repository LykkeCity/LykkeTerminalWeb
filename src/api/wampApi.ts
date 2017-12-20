const autobahn = require('autobahn');

export class WampApi {
  session: any;

  connect = (url: string, realm: string) => {
    const connection = new autobahn.Connection({url, realm});

    connection.onopen = (session: any) => {
      this.session = session;
    };

    connection.open();
  };

  subscribe = (topic: string, cb: any) => {
    this.session.subscribe(topic, cb);
  };

  publish = (topic: string, event: [any]) => {
    this.session.publish(topic, event);
  };

  register = (topic: string, procedure: any) => {
    this.session.register(topic, procedure);
  };

  call = (topic: string, procedure: any) => {
    this.session.call(topic, procedure);
  };
}

const wamp = new WampApi();
wamp.connect('wss://wamp.lykke.com/ws/', 'prices');
// wamp.subscribe('candle.spot.eurusd.mid.sec', function onEvent(args: [any]) {});

export default WampApi;
