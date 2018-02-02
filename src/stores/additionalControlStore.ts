import {observable} from 'mobx';
import {BaseStore, RootStore} from './index';

class AdditionalControlStore extends BaseStore {
  @observable conditions: any[] = [];

  constructor(store: RootStore) {
    super(store);
  }

  construct = (store: any, method: string) => {
    return this.rootStore[store][method];
  };

  reset = () => {
    return;
  };
}

export default AdditionalControlStore;
