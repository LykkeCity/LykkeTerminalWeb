import {pathOr} from 'rambda';
import {AssetModel, InstrumentModel} from '../../models/index';
import {connect} from '../connect';
import {withStyledTrackedScroll} from '../CustomScrollbar/withScroll';
import {tableScrollMargin} from '../styled';
import InstrumentList, {InstrumentListProps} from './InstrumentList';
import InstrumentPicker, {InstrumentPickerProps} from './InstrumentPicker';
import InstrumentTable from './InstrumentTable';

export interface InstrumentPickerActions {
  onToggle?: any;
  onPick?: (instrument: any) => void;
  onSearch?: (term: string) => void;
  onSearchWalletName?: (name: string) => void;
}

const connectedInstrumentPicker = connect<InstrumentPickerProps>(
  ({authStore, referenceStore, uiStore, watchlistStore}) => {
    return {
      baseAsset:
        referenceStore.getAssetById(referenceStore.baseAssetId) ||
        new AssetModel({}),
      instrumentId: pathOr(undefined, ['selectedInstrument', 'id'], uiStore),
      value: pathOr(undefined, ['selectedInstrument', 'displayName'], uiStore),
      show: uiStore.showInstrumentPicker,
      hideSearch: uiStore.hideInstrumentPickerSearch,
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
      setSelectedWatchListName: uiStore.setSelectedWatchListName,
      getSelectedWatchListName: uiStore.getSelectedWatchListName
    };
  },
  InstrumentPicker
);

const connectedInstrumentList = connect<InstrumentListProps>(
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
  height: 'calc(100% - 40px)'
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
