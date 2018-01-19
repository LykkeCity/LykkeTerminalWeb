import autobahn, {OnChallengeHandler, Session} from 'autobahn';

// tslint:disable:object-literal-sort-keys
export class WampApi {
  private session: Session;

  private key: string;

  connect = (
    url: string | undefined,
    realm: string | undefined,
    authId: string = '',
    key: string = ''
  ) => {
    this.key = key;
    return new Promise(resolve => {
      if (this.session) {
        resolve(this.session);
      }

      const connection = new autobahn.Connection({
        url,
        realm,
        authmethods: ['token'],
        authid: authId,
        onchallenge: this.handleChallenge
      });

      connection.onopen = (session: Session) => {
        this.session = session;
        resolve(session);
      };

      connection.open();
    });
  };

  subscribe = (topic: string, cb: any) => this.session.subscribe(topic, cb);

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
(window as any).wamp = instance;
export default instance;
