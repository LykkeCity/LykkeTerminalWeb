import autobahn, {
  Connection,
  IConnectionOptions,
  OnChallengeHandler,
  Session,
  Subscription
} from 'autobahn';
import {keys} from '../models';
import {StorageUtils} from '../utils/index';

const tokenStorage = StorageUtils(keys.token);

const DEFAULT_THROTTLE_DURATION = 60000;

class ConnectionWrapper extends Connection {
  isConnectionOpened: boolean = false;
}

// tslint:disable-next-line:max-classes-per-file
export class WampApi {
  isThrottled: boolean = false;

  private session: Session;
  private connection: ConnectionWrapper;

  private subscriptions: Map<string, Subscription> = new Map();

  private timer: any;

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
    return subscription;
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

  resetTimer = () => {
    this.isThrottled = false;
    clearTimeout(this.timer);
  };

  throttle = (callback: any, duration: number) => {
    this.isThrottled = true;
    this.timer = setTimeout(() => {
      callback.call();
      this.resetTimer();
    }, duration);
  };

  pause = () => {
    if (
      this.connection &&
      this.connection.isConnectionOpened &&
      !this.isThrottled
    ) {
      this.throttle(() => this.connection.close(), DEFAULT_THROTTLE_DURATION);
    }
  };

  continue = () => {
    this.resetTimer();
    if (this.connection && !this.connection.isConnectionOpened) {
      this.connection.open();
    }
  };

  publish = (topic: string, event: [any]) => this.session.publish(topic, event);

  register = (topic: string, procedure: any) =>
    this.session.register(topic, procedure);

  call = (topic: string, procedure: any) => this.session.call(topic, procedure);

  get isConnectionOpened(): boolean {
    return this.connection.isConnectionOpened;
  }

  set isConnectionOpened(isConnectionOpened: boolean) {
    this.connection.isConnectionOpened = isConnectionOpened;
  }

  // tslint:disable-next-line:variable-name
  private _connect = (options: IConnectionOptions) =>
    new Promise<Session>(resolve => {
      if (this.session) {
        resolve(this.session);
      }

      this.connection = new autobahn.Connection(options) as ConnectionWrapper;

      this.connection.onopen = (session: Session) => {
        this.isConnectionOpened = true;
        this.session = session;
        this.subscribeToAll();
        resolve(session);
      };

      this.connection.onclose = () => {
        this.isConnectionOpened = false;
        return false;
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
