import autobahn, {
  Connection,
  IConnectionOptions,
  OnChallengeHandler,
  Session,
  Subscription
} from 'autobahn';
import keys from '../constants/storageKeys';
import {StorageUtils} from '../utils/index';

const tokenStorage = StorageUtils(keys.token);

// tslint:disable:object-literal-sort-keys
export class WampApi {
  private session: Session;
  private connection: Connection;

  private subscriptions: Map<string, Subscription> = new Map();

  connect = (url: string, realm: string, authId?: string) => {
    let options: IConnectionOptions = {url, realm, max_retries: -1};
    if (authId) {
      options = {
        ...options,
        authmethods: ['ticket'],
        authid: authId,
        onchallenge: this.handleChallenge
      };
    }
    return this._connect(options);
  };

  subscribe = async (topic: string, cb: any) => {
    const subscription = await this.session.subscribe(topic, cb);
    this.subscriptions.set(topic, subscription);
  };

  unsubscribe = async (subscription: Subscription) => {
    const topic = subscription.topic;
    if (this.subscriptions.has(topic)) {
      await this.subscriptions.get(topic)!.unsubscribe();
      this.subscriptions.delete(topic);
    }
  };

  close = () => {
    this.unsubscribeFromAll();
    this.connection.close();
  };

  publish = (topic: string, event: [any]) => this.session.publish(topic, event);

  register = (topic: string, procedure: any) =>
    this.session.register(topic, procedure);

  call = (topic: string, procedure: any) => this.session.call(topic, procedure);

  // tslint:disable-next-line:variable-name
  private _connect = (options: IConnectionOptions) =>
    new Promise<Session>(resolve => {
      if (this.session) {
        resolve(this.session);
      }

      this.connection = new autobahn.Connection(options);

      this.connection.onopen = (session: Session) => {
        this.session = session;
        this.subscribeToAll();
        resolve(session);
      };

      this.connection.open();
    });

  private subscribeToAll = () => {
    this.subscriptions.forEach(subscription =>
      this.subscribe(
        subscription.topic,
        this.subscriptions.get(subscription.topic)!.handler
      )
    );
  };

  private unsubscribeFromAll = () => {
    this.subscriptions.forEach(this.unsubscribe);
  };

  private handleChallenge: OnChallengeHandler = (session, method) => {
    if (method === 'ticket') {
      return tokenStorage.get() as string;
    }
    return '';
  };
}

export default WampApi;
