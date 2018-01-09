import autobahn from 'autobahn';

export class WampApi {
  private static instance: WampApi;
  session: any;

  connect = (url: string | undefined, realm: string | undefined) =>
    new Promise((resolve: any) => {
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

  subscribe = (topic: string | undefined, cb: any) => {
    return this.session.subscribe(topic, cb);
  };

  publish = (topic: string | undefined, event: [any]) => {
    this.session.publish(topic, event);
  };

  register = (topic: string | undefined, procedure: any) => {
    this.session.register(topic, procedure);
  };

  call = (topic: string | undefined, procedure: any) => {
    this.session.call(topic, procedure);
  };

  get currentSession() {
    return this.session;
  }

  static get Instance() {
    return this.instance || (this.instance = new this());
  }
}

const WampInstance = WampApi.Instance;

export default WampInstance;
