import {
  AssetApi,
  AuthApi,
  BalanceListApi,
  OrderBookApi,
  OrderListApi,
  TradeListApi,
  WampApi,
  WatchlistApi
} from '../api/index';
import {
  AuthStore,
  BalanceListStore,
  BaseStore,
  OrderBookStore,
  OrderListStore,
  ReferenceStore,
  TradeListStore,
  UiStore,
  WatchlistStore
} from './index';

class RootStore {
  readonly watchlistStore: WatchlistStore;
  readonly tradeListStore: TradeListStore;
  readonly orderBookStore: OrderBookStore;
  readonly balanceListStore: BalanceListStore;
  readonly orderListStore: OrderListStore;
  readonly uiStore: UiStore;
  readonly referenceStore: ReferenceStore;
  readonly authStore: AuthStore;

  private readonly stores = new Set<BaseStore>();

  constructor(shouldStartImmediately = true) {
    if (shouldStartImmediately) {
      this.watchlistStore = new WatchlistStore(this, new WatchlistApi());
      this.tradeListStore = new TradeListStore(this, new TradeListApi());
      this.orderBookStore = new OrderBookStore(this, new OrderBookApi());
      this.balanceListStore = new BalanceListStore(this, new BalanceListApi());
      this.orderListStore = new OrderListStore(this, new OrderListApi());
      this.uiStore = new UiStore();
      this.referenceStore = new ReferenceStore(this, new AssetApi());
      this.authStore = new AuthStore(this, new AuthApi());
    }
  }

  start = async () => {
    await this.authStore.fetchBearerToken();
    await this.referenceStore.fetchReferenceData();
    await this.watchlistStore.fetchAll();
    await this.tradeListStore.fetchAll();
    await this.orderBookStore.fetchAll();
    await this.balanceListStore.fetchAll();
    await this.orderListStore.fetchAll();
    const ws = new WampApi();
    ws
      .connect(process.env.REACT_APP_WAMP_URL, process.env.REACT_APP_WAMP_REALM)
      .then(() => {
        this.referenceStore
          .getInstruments()
          .forEach(x =>
            ws.subscribe(`quote.spot.${x.id.toLowerCase()}.bid`, this.onQuote)
          );
      });
  };

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = () => {
    Array.from(this.stores).forEach(s => s.reset());
  };

  private onQuote = (args: any) => {
    const {a: id, p: price} = args[0];
    const instrument = this.referenceStore.findInstrumentById(id);
    if (instrument && instrument.id) {
      instrument.updatePrice(price);
    }
  };
}

export default RootStore;
