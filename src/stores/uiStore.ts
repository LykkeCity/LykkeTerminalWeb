import {action, observable} from 'mobx';
import {InstrumentModel} from '../models/index';
import {BaseStore, RootStore} from './index';

class UiStore extends BaseStore {
  readonly DEFAULT_INSTRUMENT = 'BTCUSD';

  @observable showAssetsSelect: boolean = false;
  @observable searchTerm: string = '';
  @observable selectedInstrument: InstrumentModel | null;
  @observable showInstrumentPicker = false;

  constructor(store: RootStore) {
    super(store);
  }

  @action
  readonly toggleAssetsSelect = () =>
    (this.showAssetsSelect = !this.showAssetsSelect);

  @action
  selectInstrument = (instrument: InstrumentModel | any) => {
    this.selectedInstrument = instrument;

    this.rootStore.chartStore.updateChart(this.selectedInstrument!.id);
  };

  @action search = (term: string) => (this.searchTerm = term);

  @action
  toggleInstrumentPicker = () =>
    (this.showInstrumentPicker = !this.showInstrumentPicker);

  reset = () => {
    this.searchTerm = '';
    this.selectedInstrument = null;
  };
}

export default UiStore;
