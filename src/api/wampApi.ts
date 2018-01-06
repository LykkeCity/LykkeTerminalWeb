import autobahn, {OnChallengeHandler} from 'autobahn';

export class WampApi {
  private static instance: WampApi;
  session: any;

  private key: string;

  connect = (
    url: string | undefined,
    realm: string | undefined,
    authId: string,
    key: string
  ) => {
    this.key = key;
    return new Promise((resolve: any) => {
      if (this.session) {
        resolve(this.session);
      }

      const connection = new autobahn.Connection({
        url,
        // tslint:disable-next-line:object-literal-sort-keys
        realm,
        authmethods: ['wampcra'],
        authid: authId,
        onchallenge: this.handleChallenge
      });

      connection.onopen = (session: any) => {
        this.session = session;
        resolve(session);
      };

      connection.open();
    });
  };

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

  private handleChallenge: OnChallengeHandler = (session, method, extra) => {
    if (method === 'wampcra') {
      return autobahn.auth_cra.sign(this.key, extra.challenge);
    }
    return '';
  };
}

const WampInstance = WampApi.Instance;

export default WampInstance;
