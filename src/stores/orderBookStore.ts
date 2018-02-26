import {ISubscription} from 'autobahn';
import {observable, runInAction} from 'mobx';
import {
  compose,
  curry,
  head,
  last,
  map,
  reverse,
  sortBy,
  take,
  takeLast,
  toLower
} from 'rambda';
import {OrderBookApi} from '../api';
import * as topics from '../api/topics';
import {Order, Side} from '../models/index';
import * as mappers from '../models/mappers';
import {BaseStore, RootStore} from './index';

const byPrice = (o: Order) => o.price;

class OrderBookStore extends BaseStore {
  @observable bids: Order[] = [];
  @observable asks: Order[] = [];
  private subscriptions: Set<ISubscription> = new Set();
  private isInitFetch: boolean = true;

  constructor(store: RootStore, private readonly api: OrderBookApi) {
    super(store);
  }

  bestBid = () => head(this.bids.map(x => x.price));

  bestAsk = () => last(this.asks.map(a => a.price));

  mid = () => (this.bestAsk() + this.bestBid()) / 2;

  bestBids = (num: number = 10) => take(num, this.bids);

  bestAsks = (num: number = 10) => takeLast(num, this.asks);

  withDepth = (orders: Order[]) => {
    const newOrders = [...orders];
    newOrders.forEach((order, idx) => {
      order.depth =
        idx === 0 ? order.volume : newOrders[idx - 1].depth + order.volume;
    });
    return newOrders;
  };

  groupByPrice = (orders: Order[]) =>
    orders.reduce((acc: Order[], curr: Order) => {
      const withSamePrice = (p: number) => p === curr.price;
      const samePriceInBook = acc.map(o => o.price).some(withSamePrice);
      if (samePriceInBook) {
        const idx = acc.map(o => o.price).findIndex(withSamePrice);
        acc[idx].volume += curr.volume;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

  onUpdate = (args: any) => {
    const {IsBuy, Levels} = args[0];
    const mapToOrders = compose<
      any[],
      Order[],
      Order[],
      Order[],
      Order[],
      Order[]
    >(
      reverse,
      sortBy(byPrice),
      this.withDepth,
      this.groupByPrice,
      map(x => mappers.mapToOrder({...x, IsBuy}))
    );
    if (IsBuy) {
      this.bids = mapToOrders(Levels);
    } else {
      this.asks = mapToOrders(Levels);
    }
  };

  fetchAll = async () => {
    const {selectedInstrument} = this.rootStore.uiStore;
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
    this.bids = this.asks = [];
    this.unsubscribe();
  };
}

export default OrderBookStore;
