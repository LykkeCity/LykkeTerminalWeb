import * as React from 'react';
import Watchlists from '../../models/watchlists';
import {
  InstrumentList,
  InstrumentPickerProps,
  InstrumentPickerStats,
  InstrumentPopover,
  InstrumentSearch,
  InstrumentSelect
} from './index';
import InstrumentShortcuts from './InstrumentShortcuts';
import {SearchWrap} from './styles';

class InstrumentPicker extends React.Component<
  InstrumentPickerProps,
  InstrumentPickerStats
> {
  constructor(props: InstrumentPickerProps) {
    super(props);
    this.state = {
      activeShortcut: 0,
      searchValue: '',
      searchWallet: Watchlists.All
    };
  }

  changeWallet = (value: string = Watchlists.All, index: number = 0) => {
    this.setState({
      activeShortcut: index,
      searchWallet: value
    });

    if (this.props.onSearchWalletName) {
      this.props.onSearchWalletName(value);
    }
  };

  changeValue = (value: string = '') => {
    this.setState({
      activeShortcut: 0,
      searchValue: value,
      searchWallet: Watchlists.All
    });

    if (this.props.onSearch) {
      this.props.onSearch(value);
    }

    if (this.props.onSearchWalletName) {
      this.props.onSearchWalletName(Watchlists.All);
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
              instruments={this.props.instruments}
              onPick={this.props.onPick}
              change={this.changeValue}
            />
          </InstrumentPopover>
        ) : null}
      </div>
    );
  }
}

export default InstrumentPicker;
