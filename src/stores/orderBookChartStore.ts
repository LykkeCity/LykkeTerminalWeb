import {action, computed, observable} from 'mobx';
import {BaseStore, RootStore} from './index';

class OrderBookChartStore extends BaseStore {
  @observable spanValue = 1;

  @computed
  get span() {
    return this.spanValue;
  }

  constructor(store: RootStore) {
    super(store);
  }

  @action
  nextSpan = () => {
    this.spanValue++;
  };

  @action
  prevSpan = () => {
    this.spanValue--;
  };

  reset = () => {
    this.spanValue = 1;
  };
}

export default OrderBookChartStore;
