import * as React from 'react';
import {
  InstrumentListItem,
  InstrumentPickerProps,
  InstrumentPopover,
  InstrumentSearch,
  InstrumentSelect
} from './index';
import InstrumentShortcuts from './InstrumentShortcuts';

interface InstrumentPickerStats {
  searchValue: string;
}

class InstrumentPicker extends React.Component<
  InstrumentPickerProps,
  InstrumentPickerStats
> {
  constructor(props: InstrumentPickerProps) {
    super(props);
    this.state = {
      searchValue: ''
    };
  }

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
        <InstrumentSelect {...this.props} onToggle={this.props.onToggle} />
        <InstrumentPopover show={this.props.show}>
          <InstrumentSearch
            inputValue={this.state.searchValue}
            change={this.changeValue}
          />
          <InstrumentShortcuts changeValue={this.changeValue} />
          {this.props.instruments.map(x => (
            <InstrumentListItem key={x.id} {...x} onPick={this.props.onPick} />
          ))}
        </InstrumentPopover>
      </div>
    );
  }
}

export default InstrumentPicker;
