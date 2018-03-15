import {
  AssetApi,
  AuthApi,
  BalanceListApi,
  ChartApi,
  OrderApi,
  OrderBookApi,
  TradeApi,
  WampApi,
  WatchlistApi
} from '../api/index';
import * as topics from '../api/topics';
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

  private readonly wampUrl = process.env.REACT_APP_WAMP_URL || '';
  private readonly wampRealm = process.env.REACT_APP_WAMP_REALM || '';

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
      this.chartStore = new ChartStore(this, new ChartApi(this));
      this.orderStore = new OrderStore(this, new OrderApi(this));
      this.settingsStore = new SettingsStore(this);
      this.additionalControlStore = new AdditionalControlStore(this);
    }
  }

  startPublicMode = (defaultInstrument: any) => {
    const ws = new WampApi();
    return ws.connect(this.wampUrl, this.wampRealm).then(session => {
      this.uiStore.setWs(ws);
      this.orderBookStore.setWs(ws);
      this.chartStore.setWs(ws);
      this.referenceStore
        .findInstruments('', Watchlists.All)
        .forEach((x: any) =>
          ws.subscribe(topics.quote(x.id), this.referenceStore.onQuote)
        );
      this.uiStore.selectInstrument(
        this.checkDefaultInstrument(defaultInstrument)
      );
      this.tradeStore.fetchPublicTrades();
      this.tradeStore.subscribeToPublicTrades(ws);
    });
  };

  start = async () => {
    await this.referenceStore.fetchReferenceData();
    await this.referenceStore.fetchRates();

    const defaultInstrument = this.referenceStore.getInstrumentById(
      UiStore.DEFAULT_INSTRUMENT
    );

    if (!this.authStore.isAuth) {
      return this.startPublicMode(defaultInstrument);
    }

    this.settingsStore.init();
    await this.watchlistStore.fetchAll();

    await this.referenceStore
      .fetchBaseAsset()
      .then(() => {
        this.tradeStore.fetchAll();
        this.balanceListStore.fetchAll();
        this.orderListStore.fetchAll();
      }, reject => Promise.resolve)
      .then(async () => {
        const instruments = this.referenceStore.getInstruments();

        const ws = new WampApi();
        await ws.connect(
          this.wampUrl,
          this.wampRealm,
          tokenStorage.get() as string
        );

        this.uiStore.setWs(ws);
        this.orderBookStore.setWs(ws);
        this.chartStore.setWs(ws);
        instruments.forEach(x =>
          ws.subscribe(topics.quote(x.id), this.referenceStore.onQuote)
        );
        this.uiStore.selectInstrument(
          this.checkDefaultInstrument(defaultInstrument)
        );
        this.tradeStore.subscribe(ws);
        this.balanceListStore.subscribe(ws);
        return Promise.resolve();
      })
      .catch(() => {
        this.startPublicMode(defaultInstrument);
      });
  };

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = () => {
    Array.from(this.stores).forEach(s => s.reset && s.reset());
  };

  private checkDefaultInstrument = (defaultInstrument: any) =>
    instrumentStorage.get()
      ? JSON.parse(instrumentStorage.get()!)
      : defaultInstrument;
}

export default RootStore;
