import {action, computed, observable} from 'mobx';
import {TradeModel} from '../models';
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

  @computed
  get bids() {
    return this.rootStore.orderBookStore.bids;
  }

  get asks() {
    return this.rootStore.orderBookStore.asks;
  }

  mid = () => this.rootStore.orderBookStore.mid();

  spread = () => {
    return (
      (this.rootStore.orderBookStore.bestAsk() -
        this.rootStore.orderBookStore.bestBid()) /
      this.rootStore.orderBookStore.bestAsk() *
      100
    );
  };

  lastTradePrice = () => {
    const trades: TradeModel[] = this.rootStore.tradeStore.getAllTrades;
    return trades[0] ? trades[0]!.price : 0;
  };

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
