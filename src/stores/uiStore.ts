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

  constructor(store: RootStore) {
    super(store);
    reaction(
      () => this.selectedInstrument,
      instrument => {
        if (instrument) {
          const {reset, fetchAll, subscribe} = this.rootStore.orderBookStore;
          fns.seq(reset, fetchAll, subscribe)();
        }
      }
    );
  }

  @action
  readonly toggleAssetsSelect = () =>
    (this.showAssetsSelect = !this.showAssetsSelect);

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
  };
}

export default UiStore;
