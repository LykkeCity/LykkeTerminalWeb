import {rem} from 'polished';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import styled from 'styled-components';
import Search from '../../models/search';
import {
  InstrumentListItem,
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

const StyledInstruments = styled.div`
  overflow: auto;
  max-height: 560px;
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

  componentDidMount() {
    if (this.props.onSearch) {
      this.props.onSearch(this.state.searchValue);
    }
  }

  changeValue = (value: string = '', index: number = 0) => {
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
            <StyledInstruments>
              <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={560}>
                {this.props.instruments.map(x => (
                  <InstrumentListItem
                    key={x.id}
                    {...x}
                    onPick={this.props.onPick}
                  />
                ))}
              </Scrollbars>
            </StyledInstruments>
          </InstrumentPopover>
        ) : null}
      </div>
    );
  }
}

export default InstrumentPicker;
