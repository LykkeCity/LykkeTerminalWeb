import {
  AssetApi,
  AuthApi,
  BalanceListApi,
  OrderApi,
  OrderListApi,
  TradeListApi,
  WampApi,
  WatchlistApi
} from '../api/index';
import keys from '../constants/storageKeys';
import {StorageUtils} from '../utils/index';
import {
  AuthStore,
  BalanceListStore,
  BaseStore,
  ChartStore,
  OrderBookStore,
  OrderListStore,
  OrderStore,
  ReferenceStore,
  TradeListStore,
  UiStore,
  WatchlistStore
} from './index';

const tokenStorage = StorageUtils(keys.token);
const notificationStorage = StorageUtils(keys.notificationId);

class RootStore {
  session: any;

  readonly watchlistStore: WatchlistStore;
  readonly tradeListStore: TradeListStore;
  readonly orderBookStore: OrderBookStore;
  readonly balanceListStore: BalanceListStore;
  readonly orderListStore: OrderListStore;
  readonly uiStore: UiStore;
  readonly referenceStore: ReferenceStore;
  readonly authStore: AuthStore;
  readonly chartStore: ChartStore;
  readonly orderStore: OrderStore;

  private readonly stores = new Set<BaseStore>();

  constructor(shouldStartImmediately = true) {
    if (shouldStartImmediately) {
      this.watchlistStore = new WatchlistStore(this, new WatchlistApi());
      this.tradeListStore = new TradeListStore(this, new TradeListApi());
      this.orderBookStore = new OrderBookStore(this);
      this.balanceListStore = new BalanceListStore(this, new BalanceListApi());
      this.orderListStore = new OrderListStore(this, new OrderListApi());
      this.uiStore = new UiStore(this);
      this.referenceStore = new ReferenceStore(this, new AssetApi());
      this.authStore = new AuthStore(this, new AuthApi());
      this.chartStore = new ChartStore();
      this.orderStore = new OrderStore(this, new OrderApi());
    }
  }

  start = async () => {
    if (!this.authStore.isAuth) {
      return Promise.resolve();
    }

    await this.watchlistStore.fetchAll();
    await this.referenceStore.fetchReferenceData();
    await this.tradeListStore.fetchAll();

    // TODO: remove this temporary default instrument selector and remove any from uiStore.ts -> selectInstrument
    const defaultInstrument = this.referenceStore.getInstrumentById(
      this.uiStore.DEFAULT_INSTRUMENT
    );

    this.balanceListStore.fetchAll();
    await this.orderListStore.fetchAll();
    WampApi.connect(
      process.env.REACT_APP_WAMP_URL,
      process.env.REACT_APP_WAMP_REALM,
      tokenStorage.get() as string,
      notificationStorage.get() as string
    ).then(() => {
      this.referenceStore
        .getInstruments()
        .forEach(x =>
          WampApi.subscribe(
            `quote.spot.${x.id.toLowerCase()}.bid`,
            this.onQuote
          )
        );
      this.uiStore.selectInstrument(defaultInstrument);
      this.tradeListStore.subscribe();
    });
  };

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = () => {
    Array.from(this.stores).forEach(s => s.reset && s.reset());
  };

  private onQuote = (args: any) => {
    const {a: id, p: price} = args[0];
    const instrument = this.referenceStore.getInstrumentById(id);
    if (instrument && instrument.id) {
      instrument.updatePrice(price);
    }
  };
}

export default RootStore;
