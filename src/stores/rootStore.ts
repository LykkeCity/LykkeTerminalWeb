import {OrderBookApi, TradeListApi, WatchlistApi} from '../api/index';
import {
  BaseStore,
  OrderBookStore,
  TradeListStore,
  WatchlistStore
} from './index';

class RootStore {
  readonly watchlistStore: WatchlistStore;
  readonly tradeListStore: TradeListStore;
  readonly orderBookStore: OrderBookStore;

  private readonly stores = new Set<BaseStore>();

  constructor(shouldStartImmediately = true) {
    if (shouldStartImmediately) {
      this.watchlistStore = new WatchlistStore(this, new WatchlistApi());
      this.tradeListStore = new TradeListStore(this, new TradeListApi());
      this.orderBookStore = new OrderBookStore(this, new OrderBookApi());
    }
  }

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = () => {
    Array.from(this.stores).forEach(s => s.reset());
  };
}

export default RootStore;
