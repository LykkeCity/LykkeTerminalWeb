import {action, computed, observable} from 'mobx';
import {reverse} from 'rambda';
import {TradeModel} from '../models';
import {BaseStore, RootStore} from './index';
import {aggregateOrders, connectLimitOrders} from './orderBookHelpers';

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
    const {
      orderListStore: {limitOrdersForThePair: limitOrders}
    } = this.rootStore;
    const aggregatedOrders = aggregateOrders(
      this.rootStore.orderBookStore.rawBids,
      this.span,
      false
    );
    return connectLimitOrders(aggregatedOrders, limitOrders, this.span, false);
  }

  get asks() {
    const {
      orderListStore: {limitOrdersForThePair: limitOrders}
    } = this.rootStore;
    const aggregatedOrders = aggregateOrders(
      this.rootStore.orderBookStore.rawAsks,
      this.span,
      true
    );
    return reverse(
      connectLimitOrders(aggregatedOrders, limitOrders, this.span, true)
    );
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
    // tslint:disable-next-line:no-console
    console.log(this.bids);
    // tslint:disable-next-line:no-console
    console.log(this.asks);
    if (this.spanMultiplierIdx > 0) {
      this.spanMultiplierIdx--;
    }
  };

  reset = () => {
    this.spanMultiplierIdx = 0;
  };
}

export default OrderBookChartStore;
