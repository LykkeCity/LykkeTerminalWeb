import * as React from 'react';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import {AssetModel} from '../../models';
import Watchlists from '../../models/watchlists';
import {AnalyticsService} from '../../services/analyticsService';
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
  hideSearch?: boolean;
  className?: string;
  showInstrumentSelection: boolean;
  onToggleInstrumentSelection: any;
  watchlistNames: string[];
  isAuth: boolean;
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
      if (this.props.onSearch && !args.hideSearch) {
        this.props.onSearch(this.state.searchValue);
      }
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
    AnalyticsService.track(AnalyticsEvents.ChangeWatchlist(value));
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
            {!this.props.hideSearch && (
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
            )}
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
