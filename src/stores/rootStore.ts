import {
  AssetApi,
  AuthApi,
  BalanceListApi,
  ChartApi,
  OrderApi,
  OrderBookApi,
  PriceApi,
  SessionApi,
  TradeApi,
  WampApi,
  WatchlistApi
} from '../api/index';
import * as topics from '../api/topics';
import messages from '../constants/notificationMessages';
import {levels} from '../models';
import {keys} from '../models';
import {PriceType} from '../models/index';
import {StorageUtils} from '../utils/index';
import {workerMock} from '../workers/worker';
import {
  AuthStore,
  BalanceListStore,
  BaseStore,
  ChartStore,
  DepthChartStore,
  MarketStore,
  ModalStore,
  NotificationStore,
  OrderBookStore,
  OrderListStore,
  OrderStore,
  PriceStore,
  ReferenceStore,
  SessionStore,
  SettingsStore,
  TradeStore,
  UiOrderStore,
  UiStore,
  WatchlistStore
} from './index';

const tokenStorage = StorageUtils(keys.token);
const instrumentStorage = StorageUtils(keys.selectedInstrument);

class RootStore {
  visibility: string;

  readonly watchlistStore: WatchlistStore;
  readonly tradeStore: TradeStore;
  readonly depthChartStore: DepthChartStore;
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
  readonly uiOrderStore: UiOrderStore;
  readonly sessionStore: SessionStore;
  readonly priceStore: PriceStore;
  readonly marketStore: MarketStore;

  private ws: WampApi = new WampApi();

  private readonly stores = new Set<BaseStore>();

  private readonly wampUrl = process.env.REACT_APP_WAMP_URL || '';
  private readonly wampRealm = process.env.REACT_APP_WAMP_REALM || '';

  constructor(shouldStartImmediately = true, worker = workerMock) {
    if (shouldStartImmediately) {
      this.referenceStore = new ReferenceStore(this, new AssetApi(this));
      this.modalStore = new ModalStore(this);
      this.notificationStore = new NotificationStore(this);
      this.watchlistStore = new WatchlistStore(this, new WatchlistApi(this));
      this.tradeStore = new TradeStore(this, new TradeApi(this));
      this.depthChartStore = new DepthChartStore(this);
      this.orderBookStore = new OrderBookStore(
        this,
        new OrderBookApi(this),
        worker
      );
      this.balanceListStore = new BalanceListStore(
        this,
        new BalanceListApi(this)
      );
      this.orderListStore = new OrderListStore(this, new OrderApi(this));
      this.uiStore = new UiStore(this);
      this.authStore = new AuthStore(this, new AuthApi(this));
      this.chartStore = new ChartStore(this, new ChartApi(this));
      this.orderStore = new OrderStore(this, new OrderApi(this));
      this.settingsStore = new SettingsStore(this);
      this.uiOrderStore = new UiOrderStore(this);
      this.sessionStore = new SessionStore(this, new SessionApi(this));
      this.priceStore = new PriceStore(this, new PriceApi());
      this.marketStore = new MarketStore(this);
    }
  }

  startPublicMode = async (defaultInstrument: any) => {
    this.ws = new WampApi();
    return this.ws.connect(this.wampUrl, this.wampRealm).then(session => {
      this.uiStore.setWs(this.ws);
      this.depthChartStore.setWs(this.ws);
      this.orderBookStore.setWs(this.ws);
      this.chartStore.setWs(this.ws);
      this.tradeStore.setWs(this.ws);
      this.priceStore.setWs(this.ws);
      this.referenceStore.getInstruments().forEach((x: any) => {
        this.ws.subscribe(topics.quote(x.id), this.referenceStore.onQuote);
        this.ws.subscribe(
          topics.quoteAsk(x.id),
          this.referenceStore.onQuoteAsk
        );
        this.ws.subscribe(
          topics.candle('spot', x.id, PriceType.Trade, 'day'),
          this.referenceStore.onCandle
        );
      });
      this.uiStore.selectInstrument(
        this.lastOrDefaultInstrument(defaultInstrument)!.id
      );
    });
  };

  start = async () => {
    this.ws = new WampApi();
    const instruments = this.referenceStore.getInstruments();
    const assets = this.referenceStore.getAssets();

    await this.referenceStore.fetchRates().catch(console.error);

    this.marketStore.init(instruments, assets);

    const defaultInstrument = this.referenceStore.getInstrumentById(
      UiStore.DEFAULT_INSTRUMENT
    );

    this.sessionStore.initUserSession();
    this.settingsStore.init();
    this.watchlistStore.fetchAll();

    await this.referenceStore
      .fetchBaseAsset()
      .then(() => {
        this.orderListStore.fetchAll();
        this.referenceStore.updateInstruments();
        this.balanceListStore.updateWalletBalances();
      }, reject => Promise.resolve)
      .then(async () => {
        await this.ws.connect(
          this.wampUrl,
          this.wampRealm,
          tokenStorage.get() as string
        );

        this.uiStore.setWs(this.ws);
        this.depthChartStore.setWs(this.ws);
        this.orderBookStore.setWs(this.ws);
        this.chartStore.setWs(this.ws);
        this.tradeStore.setWs(this.ws);
        this.priceStore.setWs(this.ws);
        instruments.forEach(x => {
          this.ws.subscribe(topics.quote(x.id), this.referenceStore.onQuote);
          this.ws.subscribe(
            topics.quoteAsk(x.id),
            this.referenceStore.onQuoteAsk
          );
          this.ws.subscribe(
            topics.candle('spot', x.id, PriceType.Trade, 'day'),
            this.referenceStore.onCandle
          );
        });
        this.orderListStore.setWs(this.ws);
        this.uiStore.selectInstrument(
          this.lastOrDefaultInstrument(defaultInstrument)!.id
        );
        this.tradeStore.subscribe(this.ws);
        this.orderStore.subscribe(this.ws);
        this.balanceListStore.subscribe(this.ws);

        if (this.uiStore.getPageVisibility()) {
          this.pause();
        }

        return Promise.resolve();
      })
      .catch(e => {
        this.startPublicMode(defaultInstrument);
      });
  };

  pause = () => this.ws.pause();

  continue = () => {
    const isDebounced = this.ws.continue();
    if (!isDebounced) {
      this.balanceListStore.fetchAll();
      this.orderListStore.fetchAll();
      this.orderBookStore.fetchAll();
      this.tradeStore.fetchPublicTrades();
    }
  };

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = () => {
    Array.from(this.stores).forEach(s => s.reset && s.reset());
  };

  private lastOrDefaultInstrument = (defaultInstrument: any) => {
    try {
      const lastUsedInstrument = JSON.parse(instrumentStorage.get()!);
      const refInstrument = this.referenceStore.getInstrumentById(
        lastUsedInstrument.id
      );
      if (refInstrument === undefined) {
        this.notificationStore.addNotification(
          levels.error,
          messages.pairNotFound(lastUsedInstrument.name)
        );
      }
      return refInstrument || defaultInstrument;
    } catch {
      return defaultInstrument;
    }
  };
}

export default RootStore;
