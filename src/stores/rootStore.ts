import {
  AssetApi,
  AuthApi,
  BalanceListApi,
  OrderApi,
  OrderBookApi,
  TradeApi,
  WampApi,
  WatchlistApi
} from '../api/index';
// import shortcuts from '../constants/shortcuts';
import keys from '../constants/storageKeys';
import InstrumentModel from '../models/instrumentModel';
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
  TradeStore,
  UiStore,
  WatchlistStore
} from './index';

const tokenStorage = StorageUtils(keys.token);
const notificationStorage = StorageUtils(keys.notificationId);

class RootStore {
  session: any;

  readonly watchlistStore: WatchlistStore;
  readonly tradeStore: TradeStore;
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
      this.watchlistStore = new WatchlistStore(this, new WatchlistApi(this));
      this.tradeStore = new TradeStore(this, new TradeApi(this));
      this.orderBookStore = new OrderBookStore(this, new OrderBookApi(this));
      this.balanceListStore = new BalanceListStore(
        this,
        new BalanceListApi(this)
      );
      this.orderListStore = new OrderListStore(this, new OrderApi(this));
      this.uiStore = new UiStore(this);
      this.referenceStore = new ReferenceStore(this, new AssetApi(this));
      this.authStore = new AuthStore(this, new AuthApi(this));
      this.chartStore = new ChartStore(this);
      this.orderStore = new OrderStore(this, new OrderApi(this));
    }
  }

  startWamp = (instruments: InstrumentModel[]) => {
    // TODO: remove this temporary default instrument selector and remove any from uiStore.ts -> selectInstrument
    const defaultInstrument = this.referenceStore.getInstrumentById(
      UiStore.DEFAULT_INSTRUMENT
    );

    WampApi.connect(
      process.env.REACT_APP_WAMP_URL,
      process.env.REACT_APP_WAMP_REALM,
      tokenStorage.get() as string,
      notificationStorage.get() as string
    ).then(() => {
      instruments.forEach(x =>
        WampApi.subscribe(`quote.spot.${x.id.toLowerCase()}.bid`, this.onQuote)
      );
      this.uiStore.selectInstrument(defaultInstrument);
      this.tradeStore.subscribe();
    });
  };

  start = async () => {
    await this.referenceStore.fetchInstruments();

    if (!this.authStore.isAuth) {
      this.authStore.catchUnauthorized();
      // instruments = shortcuts.reduce((i: any, item) => {
      //   return [...i, ...this.referenceStore.findInstruments(item.value)];
      // }, []);
      // this.startWamp(instruments);
      // return Promise.resolve();
    }

    await this.watchlistStore.fetchAll();
    await this.referenceStore.fetchReferenceData();
    await this.tradeStore.fetchAll();

    await this.balanceListStore.fetchAll();
    await this.orderListStore.fetchAll();

    const instruments = this.referenceStore.getInstruments();
    this.startWamp(instruments);
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
