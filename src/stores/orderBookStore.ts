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
import {Order, Side} from '../models/index';
import * as mappers from '../models/mappers';
import {BaseStore, RootStore} from './index';

const topicByAssetAndSide = (asset: string, side: Side) =>
  `orderbook.${asset.toLowerCase()}.${side.toLowerCase()}`;

const byPrice = (o: Order) => o.price;

class OrderBookStore extends BaseStore {
  @observable private bids: Order[] = [];
  @observable private asks: Order[] = [];

  constructor(store: RootStore) {
    super(store);
  }

  subscribe = () => {
    const topicBySide = curry(topicByAssetAndSide)(
      this.rootStore.uiStore.selectedInstrument!.id
    );
    WampApi.subscribe(topicBySide(Side.Buy), this.onUpdate);
    WampApi.subscribe(topicBySide(Side.Sell), this.onUpdate);
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
      map(x => mappers.mapDtoToOrder({...x, IsBuy}))
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
