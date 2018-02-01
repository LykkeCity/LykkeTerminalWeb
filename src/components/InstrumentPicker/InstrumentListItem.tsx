import {observer} from 'mobx-react';
import {lighten, rem} from 'polished';
import * as React from 'react';
import {Dir} from '../../models';
import {InstrumentModel} from '../../models/index';
import styled from '../styled';
import {InstrumentField, InstrumentPickerActions} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

interface InstrumentListItemProps extends InstrumentPickerActions {
  instrument: InstrumentModel;
}

const StyledInstrumentItem = styled(Flex)`
  margin-top: 10px;
  cursor: pointer;
  justify-content: space-between;
  :hover {
    background: ${lighten(0.05, '#3c3c3c')};
  }
`;

const StyledInstrumentField = styled(InstrumentField)`
  padding: ${rem(10)};
  text-align: left;
`;

const StyledInstrumentName = StyledInstrumentField.extend`
  min-width: ${rem(150)};
`;

const StyledInstrumentPrice = StyledInstrumentField.extend`
  color: ${p => (p.dir === Dir.Up ? '#13b72a' : '#ff3e2e')};
  text-align: right;
  min-width: ${rem(100)};
`;

const InstrumentListItem: React.SFC<InstrumentListItemProps> = observer(
  ({instrument, onPick}) => {
    const {
      id,
      name = '',
      price = 0,
      accuracy,
      change = 0,
      dir = Dir.Up
    } = instrument;
    return (
      <StyledInstrumentItem
        // tslint:disable-next-line:jsx-no-lambda
        onClick={() => onPick && onPick({id, name, price, change, accuracy})}
      >
        <StyledInstrumentName>{name}</StyledInstrumentName>
        <StyledInstrumentPrice dir={dir}>
          {price.toFixed(accuracy)}
        </StyledInstrumentPrice>
      </StyledInstrumentItem>
    );
  }
);

export default InstrumentListItem;
