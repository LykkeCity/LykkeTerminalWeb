import {pathOr} from 'rambda';
import {InstrumentModel} from '../../models/index';
import {connect} from '../connect';
import InstrumentPicker from './InstrumentPicker';

export interface InstrumentPickerActions {
  onToggle?: any;
  onPick?: (instrument: any) => void;
  onSearch?: (term: string) => void;
  onSearchWalletName?: (name: string) => void;
}

export interface InstrumentPickerProps extends InstrumentPickerActions {
  instruments: InstrumentModel[];
  value: string;
  show: boolean;
  className?: string;
  watchlistNames: string[];
}

export interface InstrumentPopoverProps extends InstrumentPickerActions {
  className?: string;
}

export interface InstrumentPickerStats {
  searchWallet: string;
  searchValue: string;
  activeShortcut: number;
}

export interface InstrumentShortcutsProps {
  changeValue: any;
  shortcutActiveIndex: null | number;
  shortcuts: string[];
}

export interface InstrumentListProps {
  change: any;
  instruments: InstrumentModel[];
  onPick: any;
}

const connectedInstrumentPicker = connect(
  ({referenceStore, uiStore, watchlistStore}) => ({
    instruments: referenceStore.findInstruments(
      uiStore.searchTerm,
      uiStore.searchWalletName
    ),
    value: pathOr(undefined, ['selectedInstrument', 'name'], uiStore),
    // tslint:disable-next-line:object-literal-sort-keys
    show: uiStore.showInstrumentPicker,
    onPick: (instrument: InstrumentModel) => {
      uiStore.selectInstrument(instrument);
      uiStore.toggleInstrumentPicker();
    },
    onToggle: uiStore.toggleInstrumentPicker,
    onSearch: uiStore.search,
    onSearchWalletName: uiStore.searchWallet,
    watchlistNames: watchlistStore.watchlistNames
  }),
  InstrumentPicker
);

export {connectedInstrumentPicker as InstrumentPicker};
export {default as InstrumentSelect} from './InstrumentSelect';
export {default as InstrumentPopover} from './InstrumentPopover';
export {default as InstrumentSearch} from './InstrumentSearch';
export {default as InstrumentField} from './InstrumentField';
export {default as InstrumentListItem} from './InstrumentListItem';
export {default as InstrumentList} from './InstrumentList';
