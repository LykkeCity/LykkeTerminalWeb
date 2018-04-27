import {action, computed, observable} from 'mobx';
import {reverse} from 'rambda';
import {Order, TradeModel} from '../models';
import {BaseStore, RootStore} from './index';
import {aggregateOrders, connectLimitOrders} from './orderBookHelpers';

class DepthChartStore extends BaseStore {
  multiplers: number[] = [0, 0.01, 0.05, 0.25, 0.5, 1];
  maxMultiplier = 5;
  @observable spanMultiplierIdx = 1;

  @computed
  get span() {
    return this.multiplers[this.spanMultiplierIdx] * 100;
  }

  constructor(store: RootStore) {
    super(store);
  }

  reduceBidsArray = (bids: Order[]) => {
    const mid = this.mid();
    const lowerBound = mid - mid * this.multiplers[this.spanMultiplierIdx];
    const filteredBids = bids.filter(bid => {
      return bid.price > lowerBound;
    });
    return filteredBids.length ? filteredBids : bids.slice(0, 1);
  };

  reduceAsksArray = (asks: Order[]) => {
    const mid = this.mid();
    const upperBound =
      mid +
      Math.max(...asks.map(ask => ask.price)) *
        this.multiplers[this.spanMultiplierIdx];
    const filteredAsks = asks.filter(ask => {
      return ask.price < upperBound;
    });
    return filteredAsks.length
      ? filteredAsks
      : asks.slice(asks.length - 1, asks.length);
  };

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
    return this.reduceBidsArray(
      connectLimitOrders(aggregatedOrders, limitOrders, this.span, false)
    );
  }

  @computed
  get asks() {
    const {
      orderListStore: {limitOrdersForThePair: limitOrders}
    } = this.rootStore;
    const aggregatedOrders = aggregateOrders(
      this.rootStore.orderBookStore.rawAsks,
      this.span,
      true
    );
    return this.reduceAsksArray(
      reverse(
        connectLimitOrders(aggregatedOrders, limitOrders, this.span, true)
      )
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
    if (this.spanMultiplierIdx < this.maxMultiplier) {
      this.spanMultiplierIdx++;
    }
  };

  @action
  prevSpan = () => {
    if (this.spanMultiplierIdx > 1) {
      this.spanMultiplierIdx--;
    }
  };

  reset = () => {
    this.spanMultiplierIdx = 0;
  };
}

export default DepthChartStore;
