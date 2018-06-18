import {action, computed, observable, reaction} from 'mobx';
import {pathOr} from 'rambda';
import {keys} from '../models';
import {
  InstrumentModel,
  OrderBookDisplayType,
  TradeFilter
} from '../models/index';
import Watchlists from '../models/watchlists';
import {fns, StorageUtils} from '../utils/index';
import {DEFAULT_INPUT_VALUE} from '../utils/inputNumber';
import {BaseStore, RootStore} from './index';

const instrumentStorage = StorageUtils(keys.selectedInstrument);

class UiStore extends BaseStore {
  @computed
  get readOnlyMode() {
    return this.isReadOnlyMode;
  }

  static readonly DEFAULT_INSTRUMENT = 'BTCUSD';

  @observable showAssetsSelect: boolean = false;
  @observable searchTerm: string = '';
  @observable searchWalletName: string = Watchlists.All;
  @observable selectedInstrument: InstrumentModel | null;
  @observable showInstrumentPicker = false;
  @observable showInstrumentPerformanceData = false;
  @observable showInstrumentSelection = false;
  @observable showOrdersSelect: boolean = false;
  @observable showSessionNotification: boolean = true;
  @observable orderbookDisplayType = OrderBookDisplayType.Volume;
  @observable isDisclaimerShown: boolean = false;
  @observable private isReadOnlyMode: boolean;
  private isPageVisible: boolean = true;

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
            setQuantityAccuracy,
            setPriceAccuracy,
            setPriceValueWithFixed,
            setQuantityValue
          } = this.rootStore.uiOrderStore;
          setPriceAccuracy(pathOr(2, ['accuracy'], instrument));
          setQuantityAccuracy(pathOr(2, ['baseAsset', 'accuracy'], instrument));
          const mid = await this.rootStore.orderBookStore.mid();
          setPriceValueWithFixed(mid);
          setQuantityValue(DEFAULT_INPUT_VALUE);

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

  setPageVisibility = (isVisible: boolean) => (this.isPageVisible = isVisible);
  getPageVisibility = () => this.isPageVisible;

  hasAsset = (
    selectedInstrument: InstrumentModel,
    assetId: string
  ): boolean => {
    return selectedInstrument.displayName!.split('/').indexOf(assetId) !== -1;
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
  selectInstrument = (id: string) => {
    const {getInstrumentById} = this.rootStore.referenceStore;
    const selectedInstrument = getInstrumentById(id);
    instrumentStorage.set(JSON.stringify(selectedInstrument));
    this.selectedInstrument = selectedInstrument!;
    this.rootStore.chartStore.renderChart();
    this.isDisclaimerShown = this.hasAsset(selectedInstrument!, 'EOS');
  };

  @action search = (term: string) => (this.searchTerm = term);
  @action searchWallet = (name: string) => (this.searchWalletName = name);

  @action
  toggleInstrumentPicker = () =>
    (this.showInstrumentPicker = !this.showInstrumentPicker);

  @action
  toggleSessionNotification = (value: boolean) =>
    (this.showSessionNotification = value);

  runReadOnlyMode = () => (this.isReadOnlyMode = true);

  stopReadOnlyMode = () => (this.isReadOnlyMode = false);

  @action
  toggleInstrumentPerformanceData = (show: boolean) =>
    (this.showInstrumentPerformanceData = show);

  changeOrderbookDisplayType = (displayType: OrderBookDisplayType) => {
    this.orderbookDisplayType = displayType;
  };

  reset = () => {
    this.searchTerm = '';
    this.searchWalletName = Watchlists.All;
  };
}

export default UiStore;
