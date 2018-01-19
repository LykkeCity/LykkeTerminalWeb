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
          const {
            reset,
            fetchAll,
            unsubscribe,
            subscribe
          } = this.rootStore.orderBookStore;
          fns.seq(reset, fetchAll, unsubscribe, subscribe)();
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
    this.rootStore.chartStore.renderChart(this.selectedInstrument!);
  };

  @action search = (term: string) => (this.searchTerm = term);

  @action
  toggleInstrumentPicker = () =>
    (this.showInstrumentPicker = !this.showInstrumentPicker);

  reset = () => {
    this.searchTerm = '';
  };
}

export default UiStore;
