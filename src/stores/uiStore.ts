import {action, observable, reaction} from 'mobx';
import keys from '../constants/storageKeys';
import {InstrumentModel, TradeFilter} from '../models/index';
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
  @observable showOrdersSelect: boolean = false;
  stateFns: any = [];
  initPriceUpdate: any;

  constructor(store: RootStore) {
    super(store);
    reaction(
      () => this.selectedInstrument,
      async instrument => {
        if (instrument) {
          const {reset, fetchAll, subscribe} = this.rootStore.orderBookStore;
          reset();
          await fetchAll(); // should be waited for loading bids and asks
          subscribe(this.getWs());

          const {
            resetTrades,
            fetchTrades,
            resetPublicTrades,
            fetchPublicTrades,
            subscribeToPublicTrades
          } = this.rootStore.tradeStore;

          if (this.rootStore.tradeStore.filter === TradeFilter.CurrentAsset) {
            fns.seq(resetTrades, fetchTrades)();
          }

          fns.seq(
            resetPublicTrades,
            fetchPublicTrades,
            subscribeToPublicTrades
          )();

          this.stateFns.forEach((f: any) => f && f(instrument));

          const {
            fetchDailyCandle,
            subscribeToDailyCandle,
            reset: resetPriceStore
          } = this.rootStore.priceStore;
          fns.seq(resetPriceStore, fetchDailyCandle, subscribeToDailyCandle)();
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

  reset = () => {
    this.searchTerm = '';
    this.searchWalletName = Watchlists.All;
    this.stateFns = [];
  };
}

export default UiStore;
