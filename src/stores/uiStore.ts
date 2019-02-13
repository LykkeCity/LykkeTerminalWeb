import {action, computed, observable, reaction} from 'mobx';
import {pathOr} from 'rambda';
import {AnalyticsEvents} from '../constants/analyticsEvents';
import {disclaimedAssets} from '../constants/assetDisclaimer';
import logger from '../Logger';
import {keys} from '../models';
import {
  InstrumentModel,
  OrderBookDisplayType,
  PriceType,
  TradeFilter
} from '../models/index';
import {
  ApiUserInfoModel,
  toUserInfoModel
} from '../models/mappers/userInfoMapper';
import UserInfoModel from '../models/userInfoModel';
import Watchlists from '../models/watchlists';
import {AnalyticsService} from '../services/analyticsService';
import {DocumentService} from '../services/documentService';
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
  @observable selectedPriceType: PriceType = PriceType.Mid;
  @observable showInstrumentPicker = false;
  @observable showInstrumentPerformanceData = false;
  @observable showInstrumentSelection = false;
  @observable showOrdersSelect: boolean = false;
  @observable showSessionNotification: boolean = true;
  @observable orderbookDisplayType = OrderBookDisplayType.Volume;
  @observable isDisclaimerShown: boolean = false;
  @observable disclaimedAssets: string[] = [];
  @observable userSelectedInstrument: string;
  @observable
  instrumentPickerSortingParameters: any = {
    sortByParam: '',
    direction: '',
    state: {}
  };

  @observable userInfo: UserInfoModel | null;
  @observable isConnectionOpened: boolean = false;
  @observable private isReadOnlyMode: boolean;

  private selectedWatchListName: string = Watchlists.All;

  constructor(store: RootStore) {
    super(store);
    reaction(
      () => this.selectedInstrument,
      async instrument => {
        if (instrument) {
          this.toggleInstrumentPerformanceData(false);

          const {reset, fetchAll, subscribe} = this.rootStore.orderBookStore;
          await reset();

          try {
            await fetchAll(); // should be waited for loading bids and asks
          } catch (error) {
            logger.logException(error);
            return;
          }

          subscribe();

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

          await resetPublicTrades();

          fns.seq(fetchPublicTrades, subscribeToPublicTrades)();

          const {
            fetchLastPrice,
            fetchDailyCandle,
            subscribeToDailyCandle,
            reset: resetPriceStore
          } = this.rootStore.priceStore;
          await resetPriceStore();
          await fetchLastPrice();
          await fetchDailyCandle();
          subscribeToDailyCandle();

          this.toggleInstrumentPerformanceData(true);
        }
      }
    );
  }

  setSocketWatcher = async () => {
    const {socketStore} = this.rootStore;
    socketStore.onConnectionOpen = () => {
      this.updateConnectionStatus();
    };
    socketStore.onConnectionClose = () => {
      this.updateConnectionStatus();
    };

    this.updateConnectionStatus();
  };

  setSelectedWatchListName = (watchListName: string) =>
    (this.selectedWatchListName = watchListName);
  getSelectedWatchListName = () => this.selectedWatchListName;

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
    const selectedOrDefaultInstrument =
      getInstrumentById(id) || getInstrumentById(UiStore.DEFAULT_INSTRUMENT);
    instrumentStorage.set(JSON.stringify(selectedOrDefaultInstrument));
    this.selectedInstrument = selectedOrDefaultInstrument!;
    DocumentService.updateDocumentTitle(this.selectedInstrument);

    this.resetDisclaimedAssets();
    disclaimedAssets.forEach(asset =>
      this.checkAssetToDisclaim(selectedOrDefaultInstrument, asset)
    );
    this.rootStore.routerStore.replace(`${selectedOrDefaultInstrument!.id}`);
  };

  @action
  selectPriceType = (priceType: PriceType) => {
    this.selectedPriceType = priceType;
  };

  @action search = (term: string) => (this.searchTerm = term);
  @action searchWallet = (name: string) => (this.searchWalletName = name);

  @action
  toggleInstrumentPicker = () => {
    this.showInstrumentPicker = !this.showInstrumentPicker;

    if (this.showInstrumentPicker) {
      AnalyticsService.track(AnalyticsEvents.OpenInstrumentPicker);
    }
  };

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
  setInstrumentPickerSortingParameters = (
    sortByParam: string,
    direction: string,
    state: any
  ) => {
    this.instrumentPickerSortingParameters = {
      sortByParam,
      direction,
      state
    };
  };

  @action
  getInstrumentPickerSortingParameters = () => {
    return this.instrumentPickerSortingParameters;
  };

  updateConnectionStatus = () => {
    this.isConnectionOpened =
      this.rootStore.socketStore.isSocketOpen() || false;
  };
  getConnectionOpened = () => this.isConnectionOpened;

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
