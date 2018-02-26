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

interface InstrumentPriceProps {
  instrument: InstrumentModel;
  dir: Dir;
}

const InstrumentPrice: React.SFC<InstrumentPriceProps> = observer(
  ({instrument: {price = 0, accuracy}, dir}) => (
    <StyledInstrumentPrice dir={dir}>
      {price.toFixed(accuracy)}
    </StyledInstrumentPrice>
  )
);

const InstrumentListItem: React.SFC<InstrumentListItemProps> = ({
  instrument,
  instrument: {dir = Dir.Up, displayName},
  onPick
}) => (
  <StyledInstrumentItem
    // tslint:disable-next-line:jsx-no-lambda
    onClick={() => onPick && onPick(instrument)}
  >
    <StyledInstrumentName>{displayName}</StyledInstrumentName>
    <InstrumentPrice instrument={instrument} dir={dir} />
  </StyledInstrumentItem>
);

export default InstrumentListItem;
