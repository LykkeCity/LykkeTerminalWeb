import {observable} from 'mobx';
import {BaseStore, RootStore} from './index';

class AdditionalControlStore extends BaseStore {
  @observable conditions: any[] = [];

  constructor(store: RootStore) {
    super(store);
  }

  getCondition = (store: any, getter: string) => {
    return this.rootStore[store][getter];
  };

  reset = () => {
    return;
  };
}

export default AdditionalControlStore;
