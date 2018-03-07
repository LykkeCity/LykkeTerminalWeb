import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import Search from '../../models/search';
import {
  InstrumentList,
  InstrumentPickerProps,
  InstrumentPickerStats,
  InstrumentPopover,
  InstrumentSearch,
  InstrumentSelect
} from './index';
import InstrumentShortcuts from './InstrumentShortcuts';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledSearchWrap = styled(Flex)`
  padding-bottom: ${rem(10)};
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
`;

class InstrumentPicker extends React.Component<
  InstrumentPickerProps,
  InstrumentPickerStats
> {
  constructor(props: InstrumentPickerProps) {
    super(props);
    this.state = {
      activeShortcut: 0,
      searchValue: Search.Default
    };
  }

  changeValue = (value: string = Search.Default, index: number = 0) => {
    this.setState({
      activeShortcut: index,
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
            <StyledSearchWrap align={'center'} justify={'space-between'}>
              <InstrumentShortcuts
                changeValue={this.changeValue}
                shortcutActiveIndex={this.state.activeShortcut}
              />
              <InstrumentSearch
                inputValue={this.state.searchValue}
                change={this.changeValue}
              />
            </StyledSearchWrap>
            <InstrumentList
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
