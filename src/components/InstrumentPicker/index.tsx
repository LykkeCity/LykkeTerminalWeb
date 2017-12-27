import {InstrumentModel} from '../../models/index';
import {connect} from '../connect';
import InstrumentPicker from './InstrumentPicker';

export interface InstrumentPickerActions {
  onToggle?: any;
  onPick?: (instrument: any) => void;
  onSearch?: (term: string) => void;
}

export interface InstrumentPickerProps extends InstrumentPickerActions {
  instruments: InstrumentModel[];
  value: string;
  show: boolean;
  className?: string;
}

const connectedInstrumentPicker = connect(
  ({referenceStore, uiStore}) => ({
    instruments: referenceStore.findInstruments(uiStore.searchTerm),
    value: uiStore.selectedInstrument && uiStore.selectedInstrument.name,
    // tslint:disable-next-line:object-literal-sort-keys
    show: uiStore.showInstrumentPicker,
    onPick: (instrument: InstrumentModel) => {
      uiStore.selectInstrument(instrument);
      uiStore.toggleInstrumentPicker();
    },
    onToggle: uiStore.toggleInstrumentPicker,
    onSearch: uiStore.search
  }),
  InstrumentPicker
);

export {connectedInstrumentPicker as InstrumentPicker};
export {default as InstrumentSelect} from './InstrumentSelect';
export {default as InstrumentPopover} from './InstrumentPopover';
export {default as InstrumentSearch} from './InstrumentSearch';
export {default as InstrumentListItem} from './InstrumentListItem';
