import autobahn, {Connection, OnChallengeHandler, Session} from 'autobahn';

// tslint:disable:object-literal-sort-keys
export class WampApi {
  private session: Session | any;
  private connection: Connection;

  private key: string;

  connect = (key: string = '', options: any) => {
    this.key = key;
    return new Promise(resolve => {
      if (this.session) {
        resolve(this.session);
      }

      this.connection = new autobahn.Connection(options);

      this.connection.onopen = (session: Session) => {
        this.session = session;
        resolve(session);
      };

      this.connection.open();
    });
  };

  authConnect = (
    url: string | undefined,
    realm: string | undefined,
    authId: string = '',
    key: string = ''
  ) =>
    this.connect(key, {
      url,
      realm,
      authmethods: ['ticket'],
      authid: authId,
      onchallenge: this.handleChallenge
    });

  unauthConnect = (url: string | undefined, realm: string | undefined) =>
    this.connect(undefined, {url, realm});

  subscribe = (topic: string, cb: any) => this.session.subscribe(topic, cb);

  close = () => {
    this.connection.close();
    this.session = null;
  };

  publish = (topic: string, event: [any]) => this.session.publish(topic, event);

  register = (topic: string, procedure: any) =>
    this.session.register(topic, procedure);

  call = (topic: string, procedure: any) => this.session.call(topic, procedure);

  get currentSession() {
    return this.session;
  }

  private handleChallenge: OnChallengeHandler = (session, method, extra) => {
    if (method === 'wampcra') {
      return autobahn.auth_cra.sign(this.key, extra.challenge);
    }
    return '';
  };
}

const instance = new WampApi();
export default instance;
