import uuid from 'uuid';
import {SessionApi} from '../api';
import {BaseStore, RootStore} from './index';

class SessionStore extends BaseStore {
  private currentSessionString: string = '';

  constructor(store: RootStore, private readonly api: SessionApi) {
    super(store);
  }

  getSessionString = () => {
    this.currentSessionString = uuid.v4();
    return this.currentSessionString;
  };

  clearSessionString = () => {
    this.currentSessionString = '';
  };

  reset = () => {
    this.api.sendSession();
    this.currentSessionString = '';
  };
}

export default SessionStore;
