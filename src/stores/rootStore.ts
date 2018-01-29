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
import shortcuts from '../constants/shortcuts';
import keys from '../constants/storageKeys';
import {StorageUtils} from '../utils/index';
import {
  AuthStore,
  BalanceListStore,
  BaseStore,
  ChartStore,
  ModalStore,
  NotificationStore,
  OrderBookStore,
  OrderListStore,
  OrderStore,
  ReferenceStore,
  SettingsStore,
  TradeStore,
  UiStore,
  WatchlistStore
} from './index';

const tokenStorage = StorageUtils(keys.token);
const notificationStorage = StorageUtils(keys.notificationId);
const instrumentStorage = StorageUtils(keys.selectedInstrument);

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
  readonly notificationStore: NotificationStore;
  readonly modalStore: ModalStore;
  readonly settingsStore: SettingsStore;

  private readonly stores = new Set<BaseStore>();

  constructor(shouldStartImmediately = true) {
    if (shouldStartImmediately) {
      this.modalStore = new ModalStore(this);
      this.notificationStore = new NotificationStore(this);
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
      this.settingsStore = new SettingsStore(this);
    }
  }

  loadForUnauthUser = (defaultInstrument: any) => {
    const instruments = shortcuts.reduce((i: any, item) => {
      return [...i, ...this.referenceStore.findInstruments(item.value)];
    }, []);

    WampApi.unauthConnect(
      process.env.REACT_APP_WAMP_URL,
      process.env.REACT_APP_WAMP_REALM
    ).then(() => {
      instruments.forEach((x: any) =>
        WampApi.subscribe(`quote.spot.${x.id.toLowerCase()}.bid`, this.onQuote)
      );
      this.uiStore.selectInstrument(
        this.checkDefaultInstrument(defaultInstrument)
      );
    });

    return Promise.resolve();
  };

  start = async () => {
    await this.referenceStore.fetchInstruments();

    const defaultInstrument = this.referenceStore.getInstrumentById(
      UiStore.DEFAULT_INSTRUMENT
    );

    if (!this.authStore.isAuth) {
      return this.loadForUnauthUser(defaultInstrument);
    }

    await this.watchlistStore
      .fetchAll()
      .then(this.referenceStore.fetchReferenceData)
      .then(this.tradeStore.fetchAll)
      .then(this.balanceListStore.fetchAll)
      .then(this.orderListStore.fetchAll)
      .then(() => {
        const instruments = this.referenceStore.getInstruments();
        WampApi.authConnect(
          process.env.REACT_APP_WAMP_URL,
          process.env.REACT_APP_WAMP_REALM,
          tokenStorage.get() as string,
          notificationStorage.get() as string
        ).then(() => {
          instruments.forEach(x =>
            WampApi.subscribe(
              `quote.spot.${x.id.toLowerCase()}.bid`,
              this.onQuote
            )
          );
          this.uiStore.selectInstrument(
            this.checkDefaultInstrument(defaultInstrument)
          );
          this.tradeStore.subscribe();
        });
      })
      .catch(() => this.loadForUnauthUser(defaultInstrument));
  };

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = () => {
    Array.from(this.stores).forEach(s => s.reset && s.reset());
    WampApi.close();
  };

  private onQuote = (args: any) => {
    const {a: id, p: price} = args[0];
    const instrument = this.referenceStore.getInstrumentById(id);
    if (instrument && instrument.id) {
      instrument.updatePrice(price);
    }
  };

  private checkDefaultInstrument = (defaultInstrument: any) =>
    instrumentStorage.get()
      ? JSON.parse(instrumentStorage.get()!)
      : defaultInstrument;
}

export default RootStore;
