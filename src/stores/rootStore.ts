import {
  BalanceListApi,
  OrderBookApi,
  OrderListApi,
  RestApi,
  TradeListApi,
  WatchlistApi
} from '../api/index';
import {
  BalanceListStore,
  BaseStore,
  OrderBookStore,
  OrderListStore,
  ReferenceStore,
  TradeListStore,
  WatchlistStore
} from './index';

class RootStore {
  readonly watchlistStore: WatchlistStore;
  readonly tradeListStore: TradeListStore;
  readonly orderBookStore: OrderBookStore;
  readonly balanceListStore: BalanceListStore;
  readonly orderListStore: OrderListStore;
  readonly referenceStore: ReferenceStore;

  private readonly stores = new Set<BaseStore>();

  constructor(shouldStartImmediately = true) {
    if (shouldStartImmediately) {
      this.watchlistStore = new WatchlistStore(this, new WatchlistApi());
      this.tradeListStore = new TradeListStore(this, new TradeListApi());
      this.orderBookStore = new OrderBookStore(this, new OrderBookApi());
      this.balanceListStore = new BalanceListStore(this, new BalanceListApi());
      this.orderListStore = new OrderListStore(this, new OrderListApi());
      this.referenceStore = new ReferenceStore(this, new RestApi());
    }
  }

  start = async () => {
    await this.referenceStore.fetchReferenceData();
    await this.watchlistStore.fetchAll();
    await this.tradeListStore.fetchAll();
    await this.orderBookStore.fetchAll();
    await this.balanceListStore.fetchAll();
    await this.orderListStore.fetchAll();
  };

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = () => {
    Array.from(this.stores).forEach(s => s.reset());
  };
}

export default RootStore;
