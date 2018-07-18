import {pathOr} from 'rambda';
import {AssetModel, InstrumentModel} from '../../models/index';
import {connect} from '../connect';
import {withStyledTrackedScroll} from '../CustomScrollbar/withScroll';
import {tableScrollMargin} from '../styled';
import InstrumentList from './InstrumentList';
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
  value: string;
  instrumentId: string;
  show: boolean;
  className?: string;
  showInstrumentSelection: boolean;
  onToggleInstrumentSelection: any;
  watchlistNames: string[];
  isAuth: boolean;
  setInstrumentPickerSortingParameters: (
    sortByParam: string,
    direction: string,
    state: any
  ) => void;
  getInstrumentPickerSortingParameters: () => any;
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
  setInstrumentPickerSortingParameters: (
    sortByParam: string,
    direction: string,
    state: any
  ) => void;
  getInstrumentPickerSortingParameters: () => any;
  defaultSortingField: string;
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
    return {
      baseAsset:
        referenceStore.getAssetById(referenceStore.baseAssetId) ||
        new AssetModel({}),
      instrumentId: pathOr(undefined, ['selectedInstrument', 'id'], uiStore),
      value: pathOr(undefined, ['selectedInstrument', 'displayName'], uiStore),
      show: uiStore.showInstrumentPicker,
      showInstrumentSelection: uiStore.showInstrumentSelection,
      onPick: (instrument: InstrumentModel) => {
        uiStore.selectInstrument(instrument.id);
        uiStore.toggleInstrumentPicker();
      },
      onToggle: uiStore.toggleInstrumentPicker,
      onToggleInstrumentSelection: uiStore.toggleInstrumentSelection,
      onSearch: uiStore.search,
      onSearchWalletName: uiStore.searchWallet,
      watchlistNames: watchlistStore.watchlistNames,
      isAuth: authStore.isAuth,
      setInstrumentPickerSortingParameters:
        uiStore.setInstrumentPickerSortingParameters,
      getInstrumentPickerSortingParameters:
        uiStore.getInstrumentPickerSortingParameters
    };
  },
  InstrumentPicker
);

const connectedInstrumentList = connect(
  ({
    uiStore: {
      setInstrumentPickerSortingParameters,
      getInstrumentPickerSortingParameters,
      searchTerm,
      searchWalletName
    },
    referenceStore: {findInstruments},
    authStore: {isAuth}
  }) => {
    return {
      instruments: findInstruments(searchTerm, searchWalletName),
      setInstrumentPickerSortingParameters,
      getInstrumentPickerSortingParameters,
      defaultSortingField: isAuth ? 'volumeInBase' : 'volume'
    };
  },
  InstrumentList
);

const connectedScrolledInstrumentTable = withStyledTrackedScroll({
  width: `calc(100% + ${tableScrollMargin})`,
  height: 'calc(100% - 80px)'
})(InstrumentTable);

export {connectedInstrumentPicker as InstrumentPicker};
export {connectedScrolledInstrumentTable as InstrumentTable};
export {connectedInstrumentList as InstrumentList};

export {default as InstrumentListItem} from './InstrumentListItem';
export {default as InstrumentSelect} from './InstrumentSelect';
export {default as InstrumentPopover} from './InstrumentPopover';
export {default as InstrumentSearch} from './InstrumentSearch';
export {
  default as InstrumentShortcutSelection
} from './InstrumentShortcutSelection';
export {default as InstrumentListNumber} from './InstrumentListNumber';
