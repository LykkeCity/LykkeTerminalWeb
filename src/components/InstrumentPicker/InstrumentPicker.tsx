import * as React from 'react';
import {AssetModel} from '../../models';
import Watchlists from '../../models/watchlists';
import {
  InstrumentList,
  InstrumentPickerActions,
  InstrumentPopover,
  InstrumentSearch,
  InstrumentSelect
} from './index';
import InstrumentShortcuts from './InstrumentShortcuts';
import {SearchWrap} from './styles';

interface InstrumentPickerState {
  searchWallet: string;
  searchValue: string;
  activeShortcut: number;
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
  setSelectedWatchListName: (name: string) => void;
  getSelectedWatchListName: () => string;
}

class InstrumentPicker extends React.Component<
  InstrumentPickerProps,
  InstrumentPickerState
> {
  constructor(props: InstrumentPickerProps) {
    super(props);
    this.state = {
      activeShortcut: 0,
      searchValue: '',
      searchWallet: Watchlists.All
    };
  }

  componentWillReceiveProps(args: InstrumentPickerProps) {
    if (args.show) {
      this.setState({
        activeShortcut: args.watchlistNames.findIndex(
          name => name === this.props.getSelectedWatchListName()
        )
      });
    }
  }

  changeWallet = (value: string = Watchlists.All, index: number = 0) => {
    this.setState({
      activeShortcut: index,
      searchWallet: value
    });

    this.props.setSelectedWatchListName(value);

    if (this.props.onSearchWalletName) {
      this.props.onSearchWalletName(value);
    }
  };

  changeValue = (value: string = '') => {
    this.setState({
      searchValue: value
    });

    if (this.props.onSearch) {
      this.props.onSearch(value);
    }
  };

  render() {
    return (
      <div>
        <InstrumentSelect {...this.props} />
        {this.props.show ? (
          <InstrumentPopover onToggle={this.props.onToggle}>
            <SearchWrap align={'center'} justify={'space-between'}>
              <InstrumentShortcuts
                changeValue={this.changeWallet}
                onToggleInstrumentSelection={
                  this.props.onToggleInstrumentSelection
                }
                shortcutActiveIndex={this.state.activeShortcut}
                shortcuts={this.props.watchlistNames}
                showInstrumentSelection={this.props.showInstrumentSelection}
              />
              <InstrumentSearch
                inputValue={this.state.searchValue}
                change={this.changeValue}
              />
            </SearchWrap>
            <InstrumentList
              baseAsset={this.props.baseAsset}
              currentInstrumentId={this.props.instrumentId}
              onPick={this.props.onPick}
              isAuth={this.props.isAuth}
              searchValue={this.state.searchValue}
            />
          </InstrumentPopover>
        ) : null}
      </div>
    );
  }
}

export default InstrumentPicker;
