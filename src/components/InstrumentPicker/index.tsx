import {pathOr} from 'rambda';
import {AssetModel, InstrumentModel} from '../../models/index';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar/withScroll';
import {tableScrollMargin} from '../styled';
import InstrumentPicker from './InstrumentPicker';
import InstrumentTable from './InstrumentTable';

export interface InstrumentPickerActions {
  onToggle?: any;
  onPick?: (instrument: any) => void;
  onSearch?: (term: string) => void;
  onSearchWalletName?: (name: string) => void;
}

export interface InstrumentPickerProps extends InstrumentPickerActions {
  baseAsset: AssetModel;
  instruments: InstrumentModel[];
  value: string;
  instrumentId: string;
  show: boolean;
  className?: string;
  showInstrumentSelection: boolean;
  onToggleInstrumentSelection: any;
  watchlistNames: string[];
  isAuth: boolean;
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
  showInstrumentSelection: boolean;
  onToggleInstrumentSelection: any;
}

export interface InstrumentListProps {
  baseAsset: AssetModel;
  currentInstrumentId: string;
  change: any;
  instruments: InstrumentModel[];
  onPick: any;
  isAuth: boolean;
}

export interface InstrumentShortcutSelectionProps {
  toggleShortcuts: any;
  onToggleInstrumentSelection: any;
  selectedShortcut: number;
  shortcuts: any[];
  showInstrumentSelection: boolean;
}

const connectedInstrumentPicker = connect(
  ({authStore, referenceStore, uiStore, watchlistStore}) => {
    const getSortedInstruments = (sortField: string) =>
      referenceStore
        .findInstruments(uiStore.searchTerm, uiStore.searchWalletName)
        .sort((a, b) => (b[sortField] || 0) - (a[sortField] || 0));

    return {
      baseAsset:
        referenceStore.getAssetById(referenceStore.baseAssetId) ||
        new AssetModel({}),
      instrumentId: pathOr(undefined, ['selectedInstrument', 'id'], uiStore),
      instruments: getSortedInstruments(
        authStore.isAuth ? 'volumeInBase' : 'volume'
      ),
      value: pathOr(undefined, ['selectedInstrument', 'displayName'], uiStore),
      show: uiStore.showInstrumentPicker,
      showInstrumentSelection: uiStore.showInstrumentSelection,
      onPick: (instrument: InstrumentModel) => {
        uiStore.selectInstrument(instrument!.id);
        uiStore.toggleInstrumentPicker();
      },
      onToggle: uiStore.toggleInstrumentPicker,
      onToggleInstrumentSelection: uiStore.toggleInstrumentSelection,
      onSearch: uiStore.search,
      onSearchWalletName: uiStore.searchWallet,
      watchlistNames: watchlistStore.watchlistNames,
      isAuth: authStore.isAuth
    };
  },
  InstrumentPicker
);

const ScrolledInstrumentTable = withStyledScroll({
  width: `calc(100% + ${tableScrollMargin})`,
  height: 'calc(100% - 80px)'
})(InstrumentTable);

export {connectedInstrumentPicker as InstrumentPicker};
export {ScrolledInstrumentTable as InstrumentTable};
export {default as InstrumentListItem} from './InstrumentListItem';
export {default as InstrumentSelect} from './InstrumentSelect';
export {default as InstrumentPopover} from './InstrumentPopover';
export {default as InstrumentSearch} from './InstrumentSearch';
export {
  default as InstrumentShortcutSelection
} from './InstrumentShortcutSelection';
export {default as InstrumentList} from './InstrumentList';
export {default as InstrumentListNumber} from './InstrumentListNumber';
