import autobahn = require('autobahn');

export class WampApi {
  session: any;

  constructor(url: string, realm: string) {
    this.connect(url, realm);
  }

  subscribe = (topic: string, cb: any) => {
    if (!this.session) {
      setTimeout(() => {
        this.subscribe(topic, cb);
      }, 100);
    } else {
      this.session.subscribe(topic, cb);
    }
  };

  publish = (topic: string, event: [any]) => {
    if (!this.session) {
      setTimeout(() => {
        this.publish(topic, event);
      }, 100);
    } else {
      this.session.publish(topic, event);
    }
  };

  register = (topic: string, procedure: any) => {
    if (!this.session) {
      setTimeout(() => {
        this.register(topic, procedure);
      }, 100);
    } else {
      this.session.register(topic, procedure);
    }
  };

  call = (topic: string, procedure: any) => {
    if (!this.session) {
      setTimeout(() => {
        this.call(topic, procedure);
      }, 100);
    } else {
      this.session.call(topic, procedure);
    }
  };

  private connect = (url: string, realm: string) => {
    const connection = new autobahn.Connection({url, realm});

    connection.onopen = (session: any) => {
      this.session = session;
    };

    connection.open();
  };
}

export default WampApi;
