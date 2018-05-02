import {action, observable, reaction} from 'mobx';
import keys from '../constants/storageKeys';
import {
  InstrumentModel,
  OrderBookDisplayType,
  TradeFilter
} from '../models/index';
import Watchlists from '../models/watchlists';
import {fns, StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const instrumentStorage = StorageUtils(keys.selectedInstrument);

class UiStore extends BaseStore {
  static readonly DEFAULT_INSTRUMENT = 'BTCUSD';

  @observable showAssetsSelect: boolean = false;
  @observable searchTerm: string = '';
  @observable searchWalletName: string = Watchlists.All;
  @observable selectedInstrument: InstrumentModel | null;
  @observable showInstrumentPicker = false;
  @observable showInstrumentPerformanceData = false;
  @observable showInstrumentSelection = false;
  @observable showOrdersSelect: boolean = false;
  @observable orderbookDisplayType = OrderBookDisplayType.Volume;

  stateFns: any = [];
  initPriceUpdate: any;

  constructor(store: RootStore) {
    super(store);
    reaction(
      () => this.selectedInstrument,
      async instrument => {
        if (instrument) {
          this.toggleInstrumentPerformanceData(false);

          const {reset, fetchAll, subscribe} = this.rootStore.orderBookStore;
          reset();

          try {
            await fetchAll(); // should be waited for loading bids and asks
          } catch (e) {
            return;
          }

          subscribe(this.getWs());

          const {
            resetTrades,
            fetchTrades,
            resetPublicTrades,
            fetchPublicTrades,
            subscribeToPublicTrades
          } = this.rootStore.tradeStore;

          if (
            this.rootStore.tradeStore.filter === TradeFilter.CurrentAsset &&
            this.rootStore.authStore.isAuth
          ) {
            fns.seq(resetTrades, fetchTrades)();
          }

          fns.seq(
            resetPublicTrades,
            fetchPublicTrades,
            subscribeToPublicTrades
          )();

          this.stateFns.forEach((f: any) => f && f(instrument));

          const {
            fetchLastPrice,
            fetchDailyCandle,
            subscribeToDailyCandle,
            reset: resetPriceStore
          } = this.rootStore.priceStore;
          resetPriceStore();
          await fetchLastPrice();
          await fetchDailyCandle();
          subscribeToDailyCandle();

          this.toggleInstrumentPerformanceData(true);
        }
      }
    );
  }

  initPriceFn = (fn: any) => {
    this.initPriceUpdate = fn;
  };

  @action
  readonly toggleAssetsSelect = () =>
    (this.showAssetsSelect = !this.showAssetsSelect);

  @action
  readonly toggleInstrumentSelection = () =>
    (this.showInstrumentSelection = !this.showInstrumentSelection);

  @action
  readonly toggleOrdersSelect = () =>
    (this.showOrdersSelect = !this.showOrdersSelect);

  @action
  selectInstrument = (instrument: InstrumentModel | any) => {
    const {getInstrumentById} = this.rootStore.referenceStore;
    const selectedInstrument = getInstrumentById(instrument.id);
    instrumentStorage.set(JSON.stringify(selectedInstrument));
    this.selectedInstrument = selectedInstrument!;
    this.rootStore.chartStore.renderChart(selectedInstrument!);
  };

  @action search = (term: string) => (this.searchTerm = term);
  @action searchWallet = (name: string) => (this.searchWalletName = name);

  @action
  toggleInstrumentPicker = () =>
    (this.showInstrumentPicker = !this.showInstrumentPicker);

  @action
  toggleInstrumentPerformanceData = (show: boolean) =>
    (this.showInstrumentPerformanceData = show);

  changeOrderbookDisplayType = (displayType: OrderBookDisplayType) => {
    this.orderbookDisplayType = displayType;
  };

  reset = () => {
    this.searchTerm = '';
    this.searchWalletName = Watchlists.All;
    this.stateFns = [];
  };
}

export default UiStore;
