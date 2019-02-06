import {RouterStore} from 'mobx-react-router';
import {without} from 'rambda';
import {
  AssetApi,
  AuthApi,
  BalanceListApi,
  ChartApi,
  DisclaimerApi,
  OrderApi,
  OrderBookApi,
  PriceApi,
  SessionApi,
  TradeApi,
  WatchlistApi
} from '../api/index';
import * as topics from '../api/topics';
import messages from '../constants/notificationMessages';
import logger from '../Logger';
import {levels} from '../models';
import {keys} from '../models';
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
  SocketStore,
  TradeStore,
  UiOrderStore,
  UiStore,
  WatchlistStore
} from './index';

const tokenStorage = StorageUtils(keys.token);
const instrumentStorage = StorageUtils(keys.selectedInstrument);

// tslint:disable:no-console
class RootStore {
  watchlistStore: WatchlistStore;
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
  readonly routerStore: RouterStore;
  readonly socketStore: SocketStore;

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
      this.orderStore = new OrderStore(
        this,
        new OrderApi(this),
        new DisclaimerApi(this)
      );
      this.settingsStore = new SettingsStore(this);
      this.uiOrderStore = new UiOrderStore(this);
      this.sessionStore = new SessionStore(this, new SessionApi(this));
      this.priceStore = new PriceStore(this, new PriceApi());
      this.marketStore = new MarketStore(this);
      this.routerStore = new RouterStore();
      this.socketStore = new SocketStore(this);
    }
  }

  startPublicMode = async (defaultInstrument: any) => {
    await this.referenceStore.fetchRates().catch(console.error);
    return this.socketStore
      .connect(
        this.wampUrl,
        this.wampRealm,
        tokenStorage.get() as string
      )
      .then(() => {
        this.uiStore.setSocketWatcher();

        this.referenceStore.getInstruments().forEach((x: any) => {
          this.socketStore.subscribe(
            topics.quote(x.id),
            this.referenceStore.onQuote
          );
          this.socketStore.subscribe(
            topics.quoteAsk(x.id),
            this.referenceStore.onQuoteAsk
          );
          this.socketStore.subscribe(
            topics.candle('spot', x.id, this.uiStore.selectedPriceType, 'day'),
            this.referenceStore.onCandle
          );
        });
        this.uiStore.selectInstrument(
          this.uiStore.userSelectedInstrument ||
            this.lastOrDefaultInstrument(defaultInstrument)!.id
        );
      });
  };

  start = async () => {
    const instruments = this.referenceStore.getInstruments();
    const assets = this.referenceStore.getAssets();

    await this.referenceStore.fetchRates().catch(console.error);

    this.marketStore.init(instruments, assets);

    const selectedOrDefaultInstrument =
      this.referenceStore.getInstrumentById(
        this.uiStore.userSelectedInstrument || UiStore.DEFAULT_INSTRUMENT
      ) || this.referenceStore.getInstruments()[0];

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
        await this.socketStore.connect(
          this.wampUrl,
          this.wampRealm,
          tokenStorage.get() as string
        );

        const {subscribe} = this.socketStore;

        this.uiStore.setSocketWatcher();
        instruments.forEach(x => {
          subscribe(topics.quote(x.id), this.referenceStore.onQuote);
          subscribe(topics.quoteAsk(x.id), this.referenceStore.onQuoteAsk);
          subscribe(
            topics.candle('spot', x.id, this.uiStore.selectedPriceType, 'day'),
            this.referenceStore.onCandle
          );
        });
        this.uiStore.selectInstrument(
          this.uiStore.userSelectedInstrument ||
            this.lastOrDefaultInstrument(selectedOrDefaultInstrument)!.id
        );
        this.tradeStore.subscribe();
        this.orderStore.subscribe();
        this.balanceListStore.subscribe();
        return Promise.resolve();
      })
      .catch(e => {
        this.startPublicMode(selectedOrDefaultInstrument);
      });
  };

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = async () => {
    const stores = Array.from(this.stores);
    const socketStore = stores.find(store => store instanceof SocketStore)!;
    const domainStores = without([socketStore], stores);

    await Promise.all(domainStores.map(s => s.reset()));
    await socketStore.reset();
  };

  private lastOrDefaultInstrument = (defaultInstrument: any) => {
    try {
      const lastUsedInstrument = JSON.parse(instrumentStorage.get()!);

      if (!lastUsedInstrument) {
        return defaultInstrument;
      }

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
    } catch (error) {
      logger.logException(error);
      return defaultInstrument;
    }
  };
}

export default RootStore;
