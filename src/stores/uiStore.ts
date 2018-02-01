import {action, observable, reaction} from 'mobx';
import keys from '../constants/storageKeys';
import {InstrumentModel} from '../models/index';
import Watchlists from '../models/watchlists';
import {fns} from '../utils/index';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const instrumentStorage = StorageUtils(keys.selectedInstrument);

class UiStore extends BaseStore {
  static readonly DEFAULT_INSTRUMENT = 'BTCUSD';

  @observable showAssetsSelect: boolean = false;
  @observable searchTerm: string = '';
  @observable searchWalletName: string = Watchlists.All;
  @observable selectedInstrument: InstrumentModel | null;
  @observable showInstrumentPicker = false;
  stateFns: any = [];

  constructor(store: RootStore) {
    super(store);
    reaction(
      () => this.selectedInstrument,
      instrument => {
        if (instrument) {
          const {reset, fetchAll, subscribe} = this.rootStore.orderBookStore;
          fns.seq(reset, fetchAll, subscribe)();
          this.stateFns.forEach((f: any) => f && f(instrument));
        }
      }
    );
  }

  @action
  readonly toggleAssetsSelect = () =>
    (this.showAssetsSelect = !this.showAssetsSelect);

  @action
  selectInstrument = (instrument: InstrumentModel | any) => {
    instrumentStorage.set(JSON.stringify(instrument));
    this.selectedInstrument = instrument;
    this.rootStore.chartStore.renderChart(this.selectedInstrument!);
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
