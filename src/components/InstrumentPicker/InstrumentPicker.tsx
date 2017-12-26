import {lighten, rem} from 'polished';
import * as React from 'react';
import {InstrumentModel} from '../../models/index';
import Dir from '../../stores/dir';
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

const asSignNum = (num: number) =>
  Number.isNaN(num) ? '' : `${num > 0 ? '+' : ''}${num.toFixed(3)}%`;

interface InstrumentListItemProps
  extends InstrumentModel,
    InstrumentPickerActions {}

const InstrumentItem = styled(Flex)`
  cursor: pointer;
  :hover {
    background: ${lighten(0.05, '#3c3c3c')};
  }
`;

const InstrumentField: React.SFC<{dir?: Dir; className?: string}> = ({
  children,
  className
}) => <div className={className}>{children}</div>;

const StyledInstrumentField = styled(InstrumentField)`
  padding: ${rem(10)};
  text-align: left;
`;

const InstrumentName = StyledInstrumentField.extend`
  min-width: ${rem(150)};
`;

const InstrumentPrice = StyledInstrumentField.extend`
  color: ${p => (p.dir === Dir.Up ? '#13b72a' : '#ff3e2e')};
  text-align: right;
  min-width: ${rem(100)};
`;

const InstrumentChange = StyledInstrumentField.extend`
  text-align: right;
  min-width: ${rem(100)};
  color: ${p => (p.dir === Dir.Up ? '#13b72a' : '#ff3e2e')};
`;

const InstrumentListItem: React.SFC<InstrumentListItemProps> = ({
  name = '',
  price = 0,
  accuracy,
  change = 0,
  dir = Dir.Up,
  onPick
}) => (
  <InstrumentItem
    // tslint:disable-next-line:jsx-no-lambda
    onClick={() => onPick && onPick({name, price, change})}
  >
    <InstrumentName>{name}</InstrumentName>
    <InstrumentPrice dir={dir}>{price.toFixed(accuracy)}</InstrumentPrice>
    <InstrumentChange dir={dir}>{asSignNum(change)}</InstrumentChange>
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
