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
import * as topics from '../api/topics';
import shortcuts from '../constants/shortcuts';
import keys from '../constants/storageKeys';
import Watchlists from '../models/watchlists';
import {StorageUtils} from '../utils/index';
import {
  AdditionalControlStore,
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
// const notificationStorage = StorageUtils(keys.notificationId);
const instrumentStorage = StorageUtils(keys.selectedInstrument);

class RootStore {
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
  readonly additionalControlStore: AdditionalControlStore;

  private readonly stores = new Set<BaseStore>();
  private sockets: WampApi[] = [];

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
      this.additionalControlStore = new AdditionalControlStore(this);
    }
  }

  loadForUnauthUser = (defaultInstrument: any) => {
    const instruments = shortcuts.reduce((i: any, item) => {
      return [
        ...i,
        ...this.referenceStore.findInstruments(item.value, Watchlists.All)
      ];
    }, []);

    const ws = new WampApi();
    this.sockets.push(ws);
    return ws
      .connect(
        process.env.REACT_APP_WAMP_URL || '',
        process.env.REACT_APP_WAMP_REALM_PRICES || ''
      )
      .then(session => {
        this.uiStore.setSession(session);
        this.chartStore.setSession(session);
        instruments.forEach((x: any) =>
          session.subscribe(topics.quote(x.id), this.referenceStore.onQuote)
        );
        this.uiStore.selectInstrument(
          this.checkDefaultInstrument(defaultInstrument)
        );
        this.tradeStore.fetchPublicTrades();
        this.tradeStore.subscribeToPublicTrades(session);
      });
  };

  start = async () => {
    await this.referenceStore.fetchReferenceData();

    const defaultInstrument = this.referenceStore.getInstrumentById(
      UiStore.DEFAULT_INSTRUMENT
    );

    if (!this.authStore.isAuth) {
      return this.loadForUnauthUser(defaultInstrument);
    }

    this.settingsStore.init();

    await this.watchlistStore
      .fetchAll()
      .then(this.referenceStore.fetchBaseAsset)
      .then(this.tradeStore.fetchAll)
      .then(this.balanceListStore.fetchAll)
      .then(this.orderListStore.fetchAll)
      .then(async () => {
        const instruments = this.referenceStore.getInstruments();

        const ws = new WampApi();
        this.sockets.push(ws);
        const session = await ws.connect(
          process.env.REACT_APP_WAMP_URL || '',
          process.env.REACT_APP_WAMP_REALM_PRICES || '',
          tokenStorage.get() as string
        );

        this.uiStore.setSession(session);
        this.chartStore.setSession(session);
        instruments.forEach(x =>
          session.subscribe(topics.quote(x.id), this.referenceStore.onQuote)
        );
        this.uiStore.selectInstrument(
          this.checkDefaultInstrument(defaultInstrument)
        );
        this.tradeStore.subscribe(session);
        this.balanceListStore.subscribe(session);
        return Promise.resolve();
      })
      .catch(() => this.loadForUnauthUser(defaultInstrument));
  };

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = () => {
    Array.from(this.stores).forEach(s => s.reset && s.reset());
    this.sockets.forEach(ws => ws.close());
    this.sockets = [];
  };

  private checkDefaultInstrument = (defaultInstrument: any) =>
    instrumentStorage.get()
      ? JSON.parse(instrumentStorage.get()!)
      : defaultInstrument;
}

export default RootStore;
