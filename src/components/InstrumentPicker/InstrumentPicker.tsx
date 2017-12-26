import {lighten, rem} from 'polished';
import * as React from 'react';
// import {InstrumentModel} from '../../models/index';
import styled from '../styled';
import {
  InstrumentPickerActions,
  InstrumentPickerProps,
  InstrumentPopover,
  InstrumentSearch,
  InstrumentSelect
} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

interface InstrumentListItemProps extends InstrumentPickerActions {
  name: string;
  price?: number;
  change?: number;
}

const InstrumentItem = styled(Flex)`
  cursor: pointer;
  :hover {
    background: ${lighten(0.05, '#3c3c3c')};
  }
`;

const InstrumentField = styled.div`
  padding: ${rem(10)};
  text-align: left;
`;

const InstrumentName = InstrumentField.extend`
  min-width: ${rem(150)};
`;

const InstrumentPrice = InstrumentField.extend`
  text-align: right;
  color: #13b72a;
`;

const InstrumentChange = InstrumentField.extend`
  text-align: right;
  color: #ff3e2e;
`;

const InstrumentListItem: React.SFC<InstrumentListItemProps> = ({
  name = '',
  price = 0,
  change = 0,
  onPick
}) => (
  <InstrumentItem
    // tslint:disable-next-line:jsx-no-lambda
    onClick={() => onPick && onPick({name, price, change})}
  >
    <InstrumentName>{name}</InstrumentName>
    <InstrumentPrice>${price.toFixed(2)}</InstrumentPrice>
    <InstrumentChange>{change.toFixed(2)}%</InstrumentChange>
  </InstrumentItem>
);

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
