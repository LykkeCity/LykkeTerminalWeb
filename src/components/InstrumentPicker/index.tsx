import {pathOr} from 'rambda';
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

export interface InstrumentPopoverProps extends InstrumentPickerActions {
  className?: string;
}

export interface InstrumentPickerStats {
  searchValue: string;
  activeShortcut: number;
}

export interface InstrumentShortcutsProps {
  changeValue: any;
  shortcutActiveIndex: null | number;
}

const connectedInstrumentPicker = connect(
  ({referenceStore, uiStore}) => ({
    instruments: referenceStore.findInstruments(uiStore.searchTerm),
    value: pathOr(undefined, ['selectedInstrument', 'name'], uiStore),
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
export {default as InstrumentField} from './InstrumentField';
export {default as InstrumentListItem} from './InstrumentListItem';
