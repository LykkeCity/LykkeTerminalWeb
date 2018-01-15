import {action, observable, reaction} from 'mobx';
import {InstrumentModel} from '../models/index';
import {fns} from '../utils/index';
import {BaseStore, RootStore} from './index';

class UiStore extends BaseStore {
  static readonly DEFAULT_INSTRUMENT = 'BTCUSD';

  @observable showAssetsSelect: boolean = false;
  @observable searchTerm: string = '';
  @observable selectedInstrument: InstrumentModel | null;
  @observable showInstrumentPicker = false;

  constructor(store: RootStore) {
    super(store);
    reaction(
      () => this.selectedInstrument,
      instrument => {
        if (instrument) {
          const {reset, unsubscribe, subscribe} = this.rootStore.orderBookStore;
          fns.seq(reset, unsubscribe, subscribe)();
        }
      }
    );
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
