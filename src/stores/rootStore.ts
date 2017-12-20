import {
  BalanceListApi,
  OrderListApi,
  TradeListApi,
  WatchlistApi
} from '../api/index';
import {
  BalanceListStore,
  BaseStore,
  OrderListStore,
  TradeListStore,
  WatchlistStore
} from './index';

class RootStore {
  readonly watchlistStore: WatchlistStore;
  readonly tradeListStore: TradeListStore;
  readonly balanceListStore: BalanceListStore;
  readonly orderListStore: OrderListStore;

  private readonly stores = new Set<BaseStore>();

  constructor(shouldStartImmediately = true) {
    if (shouldStartImmediately) {
      this.watchlistStore = new WatchlistStore(this, new WatchlistApi());
      this.tradeListStore = new TradeListStore(this, new TradeListApi());
      this.balanceListStore = new BalanceListStore(this, new BalanceListApi());
      this.orderListStore = new OrderListStore(this, new OrderListApi());
    }
  }

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = () => {
    Array.from(this.stores).forEach(s => s.reset());
  };
}

export default RootStore;
