import {Socket} from '@lykkex/subzero';
import {
  IWampMessageOptions,
  WampConnection,
  WampMessageType
} from '@lykkex/subzero-wamp';
import {IConnectionOptions, OnChallengeHandler} from 'autobahn';
import {Backoff, createBackoff} from '../api/backoffApi';
import {keys} from '../models';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const tokenStorage = StorageUtils(keys.token);

class SocketStore extends BaseStore {
  private socket: Socket | null;
  private listeners: Map<string, () => void> = new Map();
  private backoff: Backoff;

  constructor(store: RootStore) {
    super(store);
  }

  connect = async (url: string, realm: string, authId?: string) => {
    let options: IConnectionOptions = {url, realm, max_retries: -1};
    if (authId) {
      options = {
        ...options,
        authmethods: ['ticket'],
        authid: authId,
        onchallenge: this.handleChallenge
      };
    }

    const wampProxy = new WampConnection(options);

    wampProxy.onopen = () => {
      this.onConnectionOpen();
    };

    wampProxy.onclose = () => {
      this.onConnectionClose();
      this.backoff.backoff();
    };

    this.socket = new Socket(wampProxy);
    await this.socket.connect();
    this.backoff = createBackoff(() => this.onBackoffReady());
    return this.socket;
  };

  subscribe = async (topic: string, callback: any) => {
    const sendingOptions: IWampMessageOptions = {
      type: WampMessageType.Subscribe,
      topic,
      callback
    };
    if (this.isSocketOpen()) {
      return await this.socket!.send(sendingOptions);
    }
  };

  unsubscribe = async (topic: string, id: string) => {
    if (this.isSocketOpen()) {
      return this.socket!.send({type: WampMessageType.Unsubscribe, topic, id});
    }
    return Promise.resolve();
  };

  reset = async () => {
    if (this.isSocketOpen()) {
      await this.socket!.close();
    }
    this.socket = null;
  };

  onBackoffReady = async () => {
    if (!this.socket) {
      return;
    }
    await this.socket!.connect();
    this.socket!.send({type: WampMessageType.SubscribeToAll});
  };

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

  isSocketOpen = () => this.socket && this.socket!.isSocketConnected();

  private handleChallenge: OnChallengeHandler = (session, method) => {
    if (method === 'ticket') {
      return tokenStorage.get() as string;
    }
    return '';
  };
}

export default SocketStore;
