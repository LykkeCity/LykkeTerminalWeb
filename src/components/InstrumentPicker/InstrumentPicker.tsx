import {observable, runInAction} from 'mobx';
import {lighten, rem} from 'polished';
import * as React from 'react';
import styled from '../styled';
import {
  InstrumentPickerActions,
  InstrumentPopover,
  InstrumentSelect
} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

interface InstrumentListItemProps extends InstrumentPickerActions {
  name: string;
  price: number;
  change: number;
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
  min-width: ${rem(80)};
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
  onPickInstrument
}) => (
  <InstrumentItem
    // tslint:disable-next-line:jsx-no-lambda
    onClick={() => onPickInstrument && onPickInstrument({name, price, change})}
  >
    <InstrumentName>{name}</InstrumentName>
    <InstrumentPrice>${price.toFixed(2)}</InstrumentPrice>
    <InstrumentChange>{change.toFixed(2)}%</InstrumentChange>
  </InstrumentItem>
);

const instruments = [
  {name: 'BTCUSD', price: 9, change: 10},
  {name: 'BTCETH', price: 9, change: 10},
  {name: 'BTCLKK', price: 9, change: 10}
];

class InstrumentPicker extends React.Component<any> {
  @observable showInstruments = false;

  handleShowInstrumentPicker = () =>
    runInAction(() => (this.showInstruments = !this.showInstruments));

  handlePickInstrument = (instrument: any) => {
    return instrument;
  };

  render() {
    return (
      <InstrumentSelect
        {...this.props}
        onShowInstrumentPicker={this.handleShowInstrumentPicker}
      >
        <InstrumentPopover show={this.showInstruments}>
          {[...instruments, ...instruments, ...instruments]
            .map((x, idx) => ({id: idx, ...x}))
            .map(x => (
              <InstrumentListItem
                key={x.id}
                {...x}
                onPickInstrument={this.handlePickInstrument}
              />
            ))}
        </InstrumentPopover>
      </InstrumentSelect>
    );
  }
}

export default InstrumentPicker;
