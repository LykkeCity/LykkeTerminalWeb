import {ISubscription} from 'autobahn';
import {action, computed, observable, runInAction} from 'mobx';
import {curry, head, last, map, reverse, sortBy, toLower} from 'rambda';
import {OrderBookApi} from '../api';
import * as topics from '../api/topics';
import {Order, Side} from '../models/index';
import * as mappers from '../models/mappers';
// import OrderModel from '../models/orderModel';
import {BaseStore, RootStore} from './index';
import {
  aggregateOrders,
  floorInt,
  getMultiplier,
  priceBetween
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
    const aggregatedOrders = aggregateOrders(this.rawBids, this.span, false);
    return this.connectLimitOrders(aggregatedOrders, this.span, false);
  }

  @computed
  get asks() {
    const aggregatedOrders = aggregateOrders(this.rawAsks, this.span, true);
    return reverse(this.connectLimitOrders(aggregatedOrders, this.span, true));
  }

  bestBid = () =>
    this.bids.length && last(sortBy(x => x.price, this.rawBids)).price;

  bestAsk = () =>
    this.asks.length && head(sortBy(x => x.price, this.rawAsks)).price;

  mid = () => (this.bestAsk() + this.bestBid()) / 2;

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

  connectLimitOrders = (orders: Order[], span: number, isAsk: boolean) => {
    const {
      uiStore: {selectedInstrument},
      orderListStore: {limitOrders}
    } = this.rootStore;
    const filteredLimitOrders = limitOrders.filter(
      order =>
        order.side === (isAsk ? Side.Sell : Side.Buy) &&
        order.symbol === (selectedInstrument && selectedInstrument.id)
    );

    filteredLimitOrders.forEach(limitOrder => {
      orders.forEach((order, idx) => {
        if (
          priceBetween(
            floorInt(order.price, span, isAsk) - span,
            floorInt(order.price, span, isAsk) + span
          )(limitOrder)
        ) {
          if (!order.connectedLimitOrders) {
            order.connectedLimitOrders = [];
          }
          order.orderVolume = (order.orderVolume || 0) + limitOrder.volume;
          (order.connectedLimitOrders || []).push(limitOrder.id);
        }
      });
    });
    return orders;
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

  onUpdate = (args: any) => {
    const {IsBuy, Levels} = args[0];
    const mapToOrders = map(x => mappers.mapToOrder({...x, IsBuy}));

    if (IsBuy) {
      this.rawBids = mapToOrders(Levels);
    } else {
      this.rawAsks = mapToOrders(Levels);
    }
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
