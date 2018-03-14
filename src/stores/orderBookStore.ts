import {ISubscription} from 'autobahn';
import {action, computed, observable, runInAction} from 'mobx';
import {
  compose,
  // curry,
  head,
  last,
  map,
  multiply,
  reverse,
  sortBy,
  take,
  takeLast,
  toLower
} from 'rambda';
import {OrderBookApi} from '../api';
// import * as topics from '../api/topics';
import {Order, Side} from '../models/index';
import * as mappers from '../models/mappers';
import OrderModel from '../models/orderModel';
import {BaseStore, RootStore} from './index';

const byPrice = (o: Order) => o.price;

export const getNextMultiplierIdx = (currIdx: number, list: number[]) =>
  Math.min(++currIdx, list.length);

export const getPrevMultiplierIdx = (currIdx: number, list: number[]) =>
  Math.max(--currIdx, 0);

export const getMultiplier = (idx: number, list: number[]) =>
  take(idx, list).reduce(multiply);

class OrderBookStore extends BaseStore {
  @observable rawBids: Order[] = [];
  @observable rawAsks: Order[] = [];

  // 0.01 0.05 0.1 0.5 1 2.5 5 10
  spanMultipliers = [1, 5, 2, 5, 2, 2.5, 2, 2, 5, 2];

  @observable spanMultiplierIdx = 0;

  @computed
  get initialSpan() {
    if (this.rootStore.uiStore.selectedInstrument) {
      return Math.pow(10, -this.rootStore.uiStore.selectedInstrument!.accuracy);
    }
    return 0;
  }

  @computed
  get span() {
    return (
      this.initialSpan *
      getMultiplier(this.spanMultiplierIdx + 1, this.spanMultipliers)
    );
  }

  private subscriptions: Set<ISubscription> = new Set();
  private isInitFetch: boolean = true;

  constructor(store: RootStore, private readonly api: OrderBookApi) {
    super(store);
  }

  @computed
  get bids() {
    return this.aggregateBy(this.span, this.rawBids);
  }

  @computed
  get asks() {
    return reverse(this.aggregateBy(this.span, reverse(this.rawAsks)));
  }

  bestBid = () => head(this.rawBids.map(x => x.price));

  bestAsk = () => last(this.rawAsks.map(a => a.price));

  mid = () => (this.bestAsk() + this.bestBid()) / 2;

  bestBids = (num: number = 10) => take(num, this.rawBids);

  bestAsks = (num: number = 10) => takeLast(num, this.rawAsks);

  addDepth = (orders: Order[]) => {
    const newOrders = [...orders];
    newOrders.forEach((order, idx) => {
      order.depth =
        idx === 0 ? order.volume : newOrders[idx - 1].depth + order.volume;
    });
    return newOrders;
  };

  groupByPrice = (orders: Order[]) =>
    orders.reduce((acc: Order[], curr: Order) => {
      const hasSamePrice = (o: Order) => o.price === curr.price;
      const hasSamePriceInBook = acc.some(hasSamePrice);
      if (hasSamePriceInBook) {
        const idx = acc.findIndex(hasSamePrice);
        acc[idx].volume += curr.volume;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

  aggregateBy = (span: number, orders: Order[]) => {
    const newOrders = orders.slice();
    if (span <= 0) {
      return newOrders;
    }

    const aggregatedOrders = [];
    let i = 0;
    let k = 0;
    while (i < newOrders.length) {
      const lowerPrice = newOrders[i].price;
      const spannedOrders = newOrders.filter(
        order => order.price >= lowerPrice && order.price < lowerPrice + span
      );
      const spannedLevel = spannedOrders.reduce((acc: any, curr: any) => {
        return {
          ...curr,
          depth: (acc.depth || 0) + curr.depth,
          price: newOrders[0].price + k * span,
          volume: (acc.volume || 0) + curr.volume
        } as Order;
      });
      aggregatedOrders.push(spannedLevel);
      k++;
      i += spannedOrders.length;
    }
    return aggregatedOrders;
  };

  onUpdate = (args: any) => {
    const {IsBuy, Levels} = args[0];
    const mapToOrders = compose(
      reverse,
      sortBy(byPrice),
      this.addDepth,
      this.groupByPrice,
      this.updateWithLimitOrders(IsBuy),
      map(x => mappers.mapToOrder({...x, IsBuy}))
    );

    if (IsBuy) {
      this.rawBids = mapToOrders(Levels) as Order[];
    } else {
      this.rawAsks = mapToOrders(Levels) as Order[];
    }
  };

  updateWithLimitOrders = (isBuy: boolean) => (orders: Order[]) => {
    const {selectedInstrument} = this.rootStore.uiStore;
    const limitOrders = this.rootStore.orderListStore.limitOrders.filter(
      (order: OrderModel) =>
        isBuy ? order.side === Side.Buy : order.side === Side.Sell
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
  incSpan = () => {
    this.spanMultiplierIdx = getNextMultiplierIdx(
      this.spanMultiplierIdx,
      this.spanMultipliers
    );
  };

  @action
  decSpan = () => {
    this.spanMultiplierIdx = getPrevMultiplierIdx(
      this.spanMultiplierIdx,
      this.spanMultipliers
    );
  };

  fetchAll = async () => {
    const {selectedInstrument} = this.rootStore.uiStore;
    if (!selectedInstrument) {
      return;
    }
    const orders = await this.api.fetchAll(toLower(selectedInstrument!.id));
    runInAction(() => {
      orders.forEach((levels: any) => this.onUpdate([levels]));
      if (this.isInitFetch && this.rootStore.uiStore.initPriceUpdate) {
        this.rootStore.uiStore.initPriceUpdate(
          this.bestBid(),
          selectedInstrument
        );
        this.isInitFetch = false;
      }
    });
  };

  subscribe = async (ws: any) => {
    // const topic = curry(topics.orderBook)(
    //   this.rootStore.uiStore.selectedInstrument!.id
    // );
    // this.subscriptions.add(await ws.subscribe(topic(Side.Buy), this.onUpdate));
    // this.subscriptions.add(await ws.subscribe(topic(Side.Sell), this.onUpdate));
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
