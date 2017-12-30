import {lighten, rem} from 'polished';
import * as React from 'react';
import {Dir} from '../../models';
import {InstrumentModel} from '../../models/index';
import {asChange} from '../../utils';
import styled from '../styled';
import {InstrumentField, InstrumentPickerActions} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

interface InstrumentListItemProps
  extends InstrumentModel,
    InstrumentPickerActions {}

const StyledInstrumentItem = styled(Flex)`
  cursor: pointer;
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

const StyledInstrumentChange = StyledInstrumentField.extend`
  text-align: right;
  min-width: ${rem(100)};
  color: ${p => (p.dir === Dir.Up ? '#13b72a' : '#ff3e2e')};
`;

const InstrumentListItem: React.SFC<InstrumentListItemProps> = ({
  id,
  name = '',
  price = 0,
  accuracy,
  change = 0,
  dir = Dir.Up,
  onPick
}) => (
  <StyledInstrumentItem
    // tslint:disable-next-line:jsx-no-lambda
    onClick={() => onPick && onPick({id, name, price, change})}
  >
    <StyledInstrumentName>{name}</StyledInstrumentName>
    <StyledInstrumentPrice dir={dir}>
      {price.toFixed(accuracy)}
    </StyledInstrumentPrice>
    <StyledInstrumentChange dir={dir}>
      {Number.isNaN(change) || asChange(change)}
    </StyledInstrumentChange>
  </StyledInstrumentItem>
);

export default InstrumentListItem;
