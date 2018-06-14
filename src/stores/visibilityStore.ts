import {observable} from 'mobx';
import BaseStore from './baseStore';

class VisibilityStore extends BaseStore {
  states = {
    visible: 'visible',
    hidden: 'hidden'
  };

  @observable private visibilityState: string;

  get visibility() {
    return this.visibilityState;
  }

  set visibility(state: string) {
    this.visibilityState = state;
  }

  // tslint:disable-next-line:no-empty
  reset = () => {};
}

export default VisibilityStore;
