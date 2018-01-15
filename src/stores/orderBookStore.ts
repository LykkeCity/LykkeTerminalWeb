import {ISubscription} from 'autobahn';
import {observable} from 'mobx';
import {
  compose,
  curry,
  head,
  last,
  map,
  reverse,
  sortBy,
  take,
  takeLast
} from 'rambda';
import {WampApi} from '../api';
import * as topics from '../api/topics';
import {Order, Side} from '../models/index';
import * as mappers from '../models/mappers';
import {BaseStore, RootStore} from './index';

const byPrice = (o: Order) => o.price;

class OrderBookStore extends BaseStore {
  @observable private bids: Order[] = [];
  @observable private asks: Order[] = [];
  private subscriptions: Set<ISubscription> = new Set();

  constructor(store: RootStore) {
    super(store);
  }

  subscribe = async () => {
    const topic = curry(topics.orderBook)(
      this.rootStore.uiStore.selectedInstrument!.id
    );
    this.subscriptions.add(
      await WampApi.subscribe(topic(Side.Buy), this.onUpdate)
    );
    this.subscriptions.add(
      await WampApi.subscribe(topic(Side.Sell), this.onUpdate)
    );
  };

  unsubscribe = () => {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions.clear();
  };

  bestBid = () => head(this.bids.map(x => x.price));

  bestAsk = () => last(this.asks.map(a => a.price));

  bestBids = (num: number = 10) => take(num, this.bids);

  bestAsks = (num: number = 10) => takeLast(num, this.asks);

  mid = () => (this.bestAsk() + this.bestBid()) / 2;

  onUpdate = (args: any) => {
    const {IsBuy, Prices} = args[0];
    const mapToOrders = compose<any[], Order[], Order[], Order[]>(
      reverse,
      sortBy(byPrice),
      map(x => mappers.mapAsOrder({...x, IsBuy}))
    );
    if (IsBuy) {
      this.bids = mapToOrders(Prices);
    } else {
      this.asks = mapToOrders(Prices);
    }
  };

  reset = () => {
    this.bids = this.asks = [];
  };
}

export default OrderBookStore;
