import {ISubscription} from 'autobahn';
import {action, computed, observable, runInAction} from 'mobx';
import {
  compose,
  curry,
  head,
  last,
  map,
  reverse,
  sortBy,
  toLower
} from 'rambda';
import {OrderBookApi} from '../api';
import * as topics from '../api/topics';
import {Order, Side} from '../models/index';
import * as mappers from '../models/mappers';
import OrderModel from '../models/orderModel';
import {BaseStore, RootStore} from './index';
import {
  aggregateOrders,
  getMultiplier,
  // getNextIdx,
  // getPrevIdx,
  groupOrdersByPrice
} from './orderBookHelpers';

class OrderBookStore extends BaseStore {
  @observable rawBids: Order[] = [];
  @observable rawAsks: Order[] = [];

  // 0.01 0.05 0.1 0.5 1 2.5 5 10
  spanMultipliers = [1, 5, 2, 5, 2, 2.5, 2, 2, 5, 2];
  @observable spanMultiplierIdx = 0;

  @computed
  get seedSpan() {
    if (this.rootStore.uiStore.selectedInstrument) {
      return Math.pow(10, -this.rootStore.uiStore.selectedInstrument.accuracy);
    }
    return 0;
  }

  @computed
  get spanMultiplier() {
    return getMultiplier(this.spanMultiplierIdx, this.spanMultipliers);
  }

  @computed
  get span() {
    return this.seedSpan * this.spanMultiplier;
  }

  private subscriptions: Set<ISubscription> = new Set();

  private isInitFetch: boolean = true;

  constructor(store: RootStore, private readonly api: OrderBookApi) {
    super(store);
  }

  @computed
  get bids() {
    return aggregateOrders(this.rawBids, this.span, false);
  }

  @computed
  get asks() {
    return reverse(aggregateOrders(this.rawAsks, this.span, true));
  }

  bestBid = () =>
    this.bids.length && last(sortBy(x => x.price, this.rawBids)).price;

  bestAsk = () =>
    this.asks.length && head(sortBy(x => x.price, this.rawAsks)).price;

  mid = () => (this.bestAsk() + this.bestBid()) / 2;

  onUpdate = (args: any) => {
    const {IsBuy, Levels} = args[0];
    const mapToOrders = compose(
      // this.updateWithLimitOrders(IsBuy),
      groupOrdersByPrice,
      map(x => mappers.mapToOrder({...x, IsBuy}))
    );

    if (IsBuy) {
      this.rawBids = mapToOrders(Levels);
    } else {
      this.rawAsks = mapToOrders(Levels);
    }
  };

  updateWithLimitOrders = (isBuy: boolean) => (orders: Order[]) => {
    const {selectedInstrument} = this.rootStore.uiStore;
    const limitOrders = this.rootStore.orderListStore.limitOrders.filter(
      order => (isBuy ? order.side === Side.Buy : order.side === Side.Sell)
    );
    limitOrders.forEach((lo: OrderModel) => {
      orders.forEach((o: Order) => {
        if (lo.price === o.price && lo.symbol === selectedInstrument!.id) {
          o.orderVolume += lo.volume;
          o.connectedLimitOrders.push(lo.id);
        }
      });
    });
    return orders;
  };

  @action
  nextSpan = () => {
    if (this.spanMultiplierIdx < this.spanMultipliers.length - 1) {
      this.spanMultiplierIdx++;
    }
  };

  @action
  prevSpan = () => {
    if (this.spanMultiplierIdx > 0) {
      this.spanMultiplierIdx--;
    }
  };

  fetchAll = async () => {
    const {selectedInstrument, initPriceUpdate} = this.rootStore.uiStore;
    if (selectedInstrument) {
      const orders = await this.api.fetchAll(toLower(selectedInstrument.id));
      runInAction(() => {
        orders.forEach((levels: any) => this.onUpdate([levels]));
        if (this.isInitFetch && initPriceUpdate) {
          initPriceUpdate(this.bestBid(), selectedInstrument);
          this.isInitFetch = false;
        }
      });
    }
  };

  subscribe = async (ws: any) => {
    const topic = curry(topics.orderBook)(
      this.rootStore.uiStore.selectedInstrument!.id
    );
    this.subscriptions.add(await ws.subscribe(topic(Side.Buy), this.onUpdate));
    this.subscriptions.add(await ws.subscribe(topic(Side.Sell), this.onUpdate));
  };

  unsubscribe = () => {
    this.subscriptions.forEach(s => this.getWs().unsubscribe(s));
    this.subscriptions.clear();
  };

  reset = () => {
    this.rawBids = this.rawAsks = [];
    this.unsubscribe();
  };
}

export default OrderBookStore;
