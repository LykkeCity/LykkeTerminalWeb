import autobahn, {
  Connection,
  IConnectionOptions,
  OnChallengeHandler,
  Session,
  Subscription
} from 'autobahn';
import {keys} from '../models';
import {StorageUtils} from '../utils/index';
import {Backoff, createBackoff} from './backoffApi';

const tokenStorage = StorageUtils(keys.token);

class ConnectionWrapper extends Connection {
  isConnectionOpened: boolean = false;
}

// tslint:disable-next-line:max-classes-per-file
export class WampApi {
  isThrottled: boolean = false;

  private session: Session;
  private connection: ConnectionWrapper;
  private backoff: Backoff;

  private listeners: Map<string, () => void> = new Map();
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

  publish = (topic: string, event: [any]) => this.session.publish(topic, event);

  register = (topic: string, procedure: any) =>
    this.session.register(topic, procedure);

  call = (topic: string, procedure: any) => this.session.call(topic, procedure);

  onBackoffReady() {
    this.connection.open();
  }

  get isConnectionOpened(): boolean {
    return this.connection.isConnectionOpened;
  }

  set isConnectionOpened(isConnectionOpened: boolean) {
    this.connection.isConnectionOpened = isConnectionOpened;
  }

  set onConnectionOpen(callback: () => void) {
    this.listeners.set('onConnectionOpen', callback);
  }
  get onConnectionOpen() {
    return this.listeners.get('onConnectionOpen') || (() => null);
  }

  set onConnectionClose(callback: () => void) {
    this.listeners.set('onConnectionClose', callback);
  }
  get onConnectionClose() {
    return this.listeners.get('onConnectionClose') || (() => null);
  }

  // tslint:disable-next-line:variable-name
  private _connect = (options: IConnectionOptions) =>
    new Promise<Session>(resolve => {
      if (this.session) {
        resolve(this.session);
      }

      this.backoff = createBackoff(() => this.onBackoffReady());

      this.connection = new autobahn.Connection(options) as ConnectionWrapper;

      this.connection.onopen = (session: Session) => {
        this.isConnectionOpened = true;
        this.session = session;
        this.subscribeToAll();
        this.onConnectionOpen();
        resolve(session);
      };

      this.connection.onclose = () => {
        this.isConnectionOpened = false;
        this.onConnectionClose();
        this.backoff.backoff();
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
