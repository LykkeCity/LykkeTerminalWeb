import {action, computed, observable, reaction} from 'mobx';
import {pathOr} from 'rambda';
import {disclaimedAssets} from '../constants/assetDisclaimer';
import logger from '../Logger';
import {keys} from '../models';
import {
  InstrumentModel,
  OrderBookDisplayType,
  TradeFilter
} from '../models/index';
import {
  ApiUserInfoModel,
  toUserInfoModel
} from '../models/mappers/userInfoMapper';
import UserInfoModel from '../models/userInfoModel';
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
  @observable disclaimedAssets: string[] = [];
  @observable userInfo: UserInfoModel | null;
  @observable private isReadOnlyMode: boolean;

  @observable private instrumentPickerScrollPosition: number = 0;
  @observable private instrumentPickerSortingParameters: any;

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
          } catch (error) {
            logger.logException(error);
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

    this.resetDisclaimedAssets();
    disclaimedAssets.forEach(asset =>
      this.checkAssetToDisclaim(selectedInstrument, asset)
    );
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

  @action
  setUserInfo = (userInfo: ApiUserInfoModel) =>
    (this.userInfo = toUserInfoModel(userInfo));
  getUserInfo = () => this.userInfo;

  @action
  setInstrumentPickerScrollPosition = (scrollPosition: number) => {
    this.instrumentPickerScrollPosition = scrollPosition;
  };

  @action
  getInstrumentPickerScrollPosition = () => {
    return this.instrumentPickerScrollPosition;
  };

  @action
  setInstrumentPickerSortingParameters = (
    sortByParam: string,
    direction: string,
    state: any
  ) => {
    this.setInstrumentPickerScrollPosition(0);
    this.instrumentPickerSortingParameters = {
      sortByParam,
      direction,
      state
    };
  };

  @action
  getInstrumentPickerSortingParameters = () => {
    if (this.instrumentPickerSortingParameters) {
      return this.instrumentPickerSortingParameters;
    }
    return {
      sortByParam: '',
      direction: '',
      state: {}
    };
  };

  private checkAssetToDisclaim = (
    selectedInstrument: InstrumentModel | undefined,
    asset: string
  ) => {
    const disclaimed = this.hasAsset(selectedInstrument!, asset);
    if (disclaimed) {
      this.disclaimedAssets.push(asset);
    }
    this.isDisclaimerShown = !!this.disclaimedAssets.length;
  };

  private resetDisclaimedAssets = () => (this.disclaimedAssets = []);
}

export default UiStore;
