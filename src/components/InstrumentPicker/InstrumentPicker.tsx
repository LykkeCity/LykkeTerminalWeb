import * as React from 'react';
import {
  InstrumentListItem,
  InstrumentPickerProps,
  InstrumentPopover,
  InstrumentSearch,
  InstrumentSelect
} from './index';

class InstrumentPicker extends React.Component<InstrumentPickerProps> {
  render() {
    return (
      <div>
        <InstrumentSelect {...this.props} onToggle={this.props.onToggle} />
        <InstrumentPopover show={this.props.show}>
          <InstrumentSearch onSearch={this.props.onSearch} />
          {this.props.instruments.map(x => (
            <InstrumentListItem key={x.id} {...x} onPick={this.props.onPick} />
          ))}
        </InstrumentPopover>
      </div>
    );
  }
}

export default InstrumentPicker;
