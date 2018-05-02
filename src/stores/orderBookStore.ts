import {ISubscription} from 'autobahn';
import {action, computed, observable, runInAction} from 'mobx';
import {compose, curry, head, last, map, reverse, sortBy, take} from 'rambda';
import {OrderBookApi} from '../api';
import * as topics from '../api/topics';
import {LEVELS_COUNT} from '../components/OrderBook';
import {Order, Side} from '../models/index';
import {toOrder} from '../models/mappers/orderMapper';
import {precisionFloor} from '../utils/math';
import {BaseStore, RootStore} from './index';
import {aggregateOrders, connectLimitOrders} from './orderBookHelpers';

// help tsc to infer correct type
const headArr: <T = Order>(l: T[]) => T = head;
const sortByPrice = sortBy(x => x.price);

class OrderBookStore extends BaseStore {
  @observable rawBids: Order[] = [];
  @observable rawAsks: Order[] = [];

  @observable
  myOrders = {
    position: {top: 0, left: 0},
    orders: [],
    volume: 0,
    onCancel: undefined
  };

  @observable hasPendingItems: boolean = true;

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
    return Math.pow(10, this.spanMultiplierIdx);
  }

  @computed
  get maxMultiplierIdx() {
    if (this.rawAsks.length > 0) {
      const sortByPriceDesc = compose(headArr, reverse, sortByPrice);
      const bestAsk = sortByPriceDesc(this.rawAsks).price;
      return Math.floor(Math.log10(bestAsk / this.seedSpan));
    }
    return 0;
  }

  @computed
  get span() {
    if (this.rootStore.uiStore.selectedInstrument) {
      return precisionFloor(
        this.seedSpan * this.spanMultiplier,
        this.rootStore.uiStore.selectedInstrument.accuracy
      );
    }
    return 0;
  }

  private subscriptions: Set<ISubscription> = new Set();

  private isInitFetch: boolean = true;

  constructor(store: RootStore, private readonly api: OrderBookApi) {
    super(store);
  }

  @computed
  get bids() {
    const {limitOrdersForThePair: limitOrders} = this.rootStore.orderListStore;
    return take(
      LEVELS_COUNT,
      connectLimitOrders(
        aggregateOrders(this.rawBids, this.span, false),
        limitOrders,
        this.span,
        false
      )
    );
  }

  @computed
  get asks() {
    const {limitOrdersForThePair: limitOrders} = this.rootStore.orderListStore;
    return take(
      LEVELS_COUNT,
      connectLimitOrders(
        aggregateOrders(this.rawAsks, this.span, true),
        limitOrders,
        this.span,
        true
      )
    );
  }

  bestBid = () =>
    this.rawBids.length && last(sortBy(x => x.price, this.rawBids)).price;

  bestAsk = () =>
    this.rawAsks.length && head(sortBy(x => x.price, this.rawAsks)).price;

  mid = () => (this.bestAsk() + this.bestBid()) / 2;

  @computed
  get spread() {
    return this.bestAsk() - this.bestBid();
  }

  @computed
  get spreadRelative() {
    return (this.bestAsk() - this.bestBid()) / this.bestAsk();
  }

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

  @action
  showMyOrders = (myOrders: any) => {
    Object.assign(this.myOrders, myOrders);
  };

  fetchAll = async () => {
    const {selectedInstrument, initPriceUpdate} = this.rootStore.uiStore;
    if (selectedInstrument) {
      this.hasPendingItems = true;
      const orders = await this.api.fetchAll(selectedInstrument.id);
      this.hasPendingItems = false;
      runInAction(() => {
        orders.forEach((levels: any) => this.onNextOrders([levels]));
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
    this.subscriptions.add(
      await ws.subscribe(topic(Side.Buy), this.onNextOrders)
    );
    this.subscriptions.add(
      await ws.subscribe(topic(Side.Sell), this.onNextOrders)
    );
  };

  onNextOrders = (args: any) => {
    const {AssetPair, IsBuy, Levels} = args[0];
    const {selectedInstrument} = this.rootStore.uiStore;
    if (selectedInstrument && selectedInstrument.id === AssetPair) {
      const mapToOrders = map(toOrder);
      if (IsBuy) {
        this.rawBids = mapToOrders(Levels).map(o => ({...o, side: Side.Buy}));
      } else {
        this.rawAsks = mapToOrders(Levels).map(o => ({...o, side: Side.Sell}));
      }
    }
  };

  unsubscribe = () => {
    const promises = Array.from(this.subscriptions).map(s => {
      // tslint:disable-next-line:no-unused-expression
      this.getWs() && this.getWs().unsubscribe;
    });
    Promise.all(promises).then(() => {
      if (this.subscriptions.size > 0) {
        this.subscriptions.clear();
      }
    });
  };

  reset = () => {
    this.rawBids = this.rawAsks = [];
    this.spanMultiplierIdx = 0;
    this.unsubscribe();
  };
}

export default OrderBookStore;
