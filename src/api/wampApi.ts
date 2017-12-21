import autobahn from 'autobahn';

export class WampApi {
  session: any;

  connect = (url: any, realm: any) => {
    return new Promise((resolve: any) => {
      if (this.session) {
        resolve(this.session);
      }

      const connection = new autobahn.Connection({url, realm});

      connection.onopen = (session: any) => {
        this.session = session;
        resolve(session);
      };

      connection.open();
    });
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

export default WampApi;
