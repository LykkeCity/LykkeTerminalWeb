import {WampApi} from '../api/index';
import {RootStore} from './index';

abstract class BaseStore {
  abstract reset: () => void;

  private ws: WampApi;

  constructor(readonly rootStore: RootStore) {
    this.rootStore.registerStore(this);
  }

  getWs = () => this.ws;

  setWs = (ws: WampApi) => {
    this.ws = ws;
  };
}

export default BaseStore;
