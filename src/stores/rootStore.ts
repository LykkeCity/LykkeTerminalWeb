import {
  BalanceListApi,
  OrderBookApi,
  OrderListApi,
  RestApi,
  TradeListApi,
  WatchlistApi
} from '../api/index';
import {
  AssetStore,
  BalanceListStore,
  BaseStore,
  OrderBookStore,
  OrderListStore,
  TradeListStore,
  WatchlistStore
} from './index';

class RootStore {
  readonly watchlistStore: WatchlistStore;
  readonly tradeListStore: TradeListStore;
  readonly orderBookStore: OrderBookStore;
  readonly balanceListStore: BalanceListStore;
  readonly orderListStore: OrderListStore;
  readonly assetStore: AssetStore;

  private readonly stores = new Set<BaseStore>();

  constructor(shouldStartImmediately = true) {
    if (shouldStartImmediately) {
      this.watchlistStore = new WatchlistStore(this, new WatchlistApi());
      this.tradeListStore = new TradeListStore(this, new TradeListApi());
      this.orderBookStore = new OrderBookStore(this, new OrderBookApi());
      this.balanceListStore = new BalanceListStore(this, new BalanceListApi());
      this.orderListStore = new OrderListStore(this, new OrderListApi());
      this.assetStore = new AssetStore(this, new RestApi());
    }
  }

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = () => {
    Array.from(this.stores).forEach(s => s.reset());
  };
}

export default RootStore;
