import {
  AssetApi,
  AuthApi,
  BalanceListApi,
  ChartApi,
  OrderApi,
  OrderBookApi,
  PriceApi,
  TradeApi,
  WampApi,
  WatchlistApi
} from '../api/index';
import * as topics from '../api/topics';
import levels from '../constants/notificationLevels';
import messages from '../constants/notificationMessages';
import ModalMessages from '../constants/modalMessages';
import {keys} from '../models';
import Types from '../models/modals';
import {PriceType} from '../models/index';
import Watchlists from '../models/watchlists';
import {StorageUtils} from '../utils/index';
import {
  AuthStore,
  BalanceListStore,
  BaseStore,
  ChartStore,
  MarketStore,
  ModalStore,
  NotificationStore,
  OrderBookStore,
  OrderListStore,
  OrderStore,
  PriceStore,
  ReferenceStore,
  SettingsStore,
  TradeStore,
  UiOrderStore,
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
  readonly uiOrderStore: UiOrderStore;
  readonly priceStore: PriceStore;
  readonly marketStore: MarketStore;

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
      this.uiOrderStore = new UiOrderStore(this);
      this.priceStore = new PriceStore(this, new PriceApi());
      this.marketStore = new MarketStore(this);
    }
  }

  startPublicMode = async (defaultInstrument: any) => {
    const ws = new WampApi();
    return ws.connect(this.wampUrl, this.wampRealm).then(session => {
      this.uiStore.setWs(ws);
      this.orderBookStore.setWs(ws);
      this.chartStore.setWs(ws);
      this.tradeStore.setWs(ws);
      this.priceStore.setWs(ws);
      this.referenceStore
        .findInstruments('', Watchlists.All)
        .forEach((x: any) => {
          ws.subscribe(topics.quote(x.id), this.referenceStore.onQuote);
          ws.subscribe(
            topics.candle('spot', x.id, PriceType.Trade, 'day'),
            this.referenceStore.onCandle
          );
        });
      this.uiStore.selectInstrument(
        this.lastOrDefaultInstrument(defaultInstrument)
      );
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

    this.modalStore.addModal(
      ModalMessages.qr,
      // tslint:disable-next-line:no-empty
      () => {},
      this.authStore.signOut,
      Types.QR
    );

    this.settingsStore.init();
    await this.watchlistStore.fetchAll();

    await this.referenceStore
      .fetchBaseAsset()
      .then(() => {
        this.balanceListStore.fetchAll();
        this.orderListStore.fetchAll();
      }, reject => Promise.resolve)
      .then(async () => {
        const instruments = this.referenceStore.getInstruments();
        const assets = this.referenceStore.getAssets();
        this.marketStore.init(instruments, assets);

        const ws = new WampApi();
        await ws.connect(
          this.wampUrl,
          this.wampRealm,
          tokenStorage.get() as string
        );

        this.uiStore.setWs(ws);
        this.orderBookStore.setWs(ws);
        this.chartStore.setWs(ws);
        this.tradeStore.setWs(ws);
        this.priceStore.setWs(ws);
        instruments.forEach(x => {
          ws.subscribe(topics.quote(x.id), this.referenceStore.onQuote);
          ws.subscribe(topics.quoteAsk(x.id), this.referenceStore.onQuoteAsk);
          ws.subscribe(
            topics.candle('spot', x.id, PriceType.Trade, 'day'),
            this.referenceStore.onCandle
          );
        });
        this.orderListStore.setWs(ws);
        this.uiStore.selectInstrument(
          this.lastOrDefaultInstrument(defaultInstrument)
        );
        this.tradeStore.subscribe(ws);
        this.orderStore.subscribe(ws);
        this.balanceListStore.subscribe(ws);

        return Promise.resolve();
      })
      .catch(e => {
        this.startPublicMode(defaultInstrument);
      });
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
