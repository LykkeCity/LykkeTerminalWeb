import {Session} from 'autobahn';
import {RootStore} from './index';

abstract class BaseStore {
  abstract reset: () => void;

  private session: Session;

  constructor(readonly rootStore: RootStore) {
    this.rootStore.registerStore(this);
  }

  getSession = () => this.session;

  setSession = (session: Session) => {
    this.session = session;
  };
}

export default BaseStore;
