import {IConnectionOptions, OnChallengeHandler} from 'autobahn';
import {Socket} from 'socket-connection';
import {
  IWampMessageOptions,
  WampConnection,
  WampMessageType
} from 'socket-connection-wamp';
import {keys} from '../models';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const tokenStorage = StorageUtils(keys.token);

class SocketStore extends BaseStore {
  private socket: Socket | null;

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

    this.socket = new Socket(new WampConnection(options));
    await this.socket.connect();
    return this.socket;
  };

  subscribe = async (topic: string, callback: any) => {
    const sendingOptions: IWampMessageOptions = {
      type: WampMessageType.Subscribe,
      topic,
      callback
    };
    return await this.socket!.send(sendingOptions);
  };

  unsubscribe = async (topic: string, id: string) => {
    await this.socket!.send({type: WampMessageType.Unsubscribe, topic, id});
  };

  reset = async () => {
    await this.socket!.close();
    this.socket = null;
  };

  private handleChallenge: OnChallengeHandler = (session, method) => {
    if (method === 'ticket') {
      return tokenStorage.get() as string;
    }
    return '';
  };
}

export default SocketStore;
