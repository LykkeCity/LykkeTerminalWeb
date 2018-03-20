import {action, computed, observable} from 'mobx';
import {BaseStore, RootStore} from './index';

class OrderBookChartStore extends BaseStore {
  @observable spanMultiplierIdx = 0;

  @computed
  get seedSpan() {
    return this.rootStore.orderBookStore.seedSpan;
  }

  @computed
  get spanMultiplier() {
    return Math.pow(10, this.spanMultiplierIdx);
  }

  @computed
  get maxMultiplierIdx() {
    return this.rootStore.orderBookStore.maxMultiplierIdx;
  }

  @computed
  get span() {
    return this.seedSpan * this.spanMultiplier;
  }

  constructor(store: RootStore) {
    super(store);
  }

  mid = () => this.rootStore.orderBookStore.mid();

  @action
  nextSpan = () => {
    if (this.spanMultiplierIdx < this.maxMultiplierIdx) {
      this.spanMultiplierIdx++;
    }
  };

  @action
  prevSpan = () => {
    if (this.spanMultiplierIdx > 0) {
      this.spanMultiplierIdx--;
    }
  };

  reset = () => {
    this.spanMultiplierIdx = 0;
  };
}

export default OrderBookChartStore;
