import {observable} from 'mobx';
import {curry, head, last, reverse, sortBy, take, takeLast} from 'rambda';
import {WampApi} from '../api';
import {Side} from '../models/index';
import {BaseStore, RootStore} from './index';

export interface Order {
  id: string;
  volume: number;
  price: number;
  timestamp: any;
  side: Side;
}

const topicByAssetAndSide = (asset: string, side: Side) =>
  `orderbook.${asset.toLowerCase()}.${side.toLowerCase()}`;

const mapFromDto = (x: any) => ({
  id: x.Id,
  price: x.Price,
  timestamp: x.DateTime,
  volume: x.Volume
});

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
    WampApi.subscribe(topicBySide(Side.Buy), this.onOrder);
    WampApi.subscribe(topicBySide(Side.Sell), this.onOrder);
  };

  bestBid = () => head(this.bids.map(x => x.price));

  bestAsk = () => last(this.asks.map(a => a.price));

  bestBids = (num: number = 10) => take(num, this.bids);

  bestAsks = (num: number = 10) => takeLast(num, this.asks);

  mid = () => (this.bestAsk() + this.bestBid()) / 2;

  onOrder = (args: any) => {
    const {IsBuy, Prices} = args[0];
    const orders = reverse(
      sortBy((o: Order) => o.price, Prices.map(mapFromDto))
    );
    if (IsBuy) {
      this.bids = orders.map(o => ({...o, side: Side.Sell}));
    } else {
      this.asks = orders.map(o => ({...o, side: Side.Buy}));
    }
  };

  reset = () => {
    this.bids = this.asks = [];
  };
}

export default OrderBookStore;
