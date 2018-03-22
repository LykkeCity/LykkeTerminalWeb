import {observer} from 'mobx-react';
import {rem} from 'polished';
import * as React from 'react';
import {InstrumentModel} from '../../models/index';
import styled from '../styled';
import {
  InstrumentField,
  InstrumentListNumber,
  InstrumentPickerActions
} from './index';
// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

interface InstrumentListItemProps extends InstrumentPickerActions {
  instrument: InstrumentModel;
  inactive: boolean;
}

const StyledInstrumentItem = styled(Flex)`
  margin-top: 10px;
  justify-content: left;
  &.inactive:hover {
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  .right-align {
    text-align: right;
  }
`;

const InstrumentListWrapper = styled(InstrumentField)`
  width: 20%;
  padding: ${rem(10)};
`;

const InstrumentListItem: React.SFC<InstrumentListItemProps> = observer(
  ({instrument, onPick, inactive}) => {
    const percentageAccuracy = 3;
    const click = () => inactive && onPick && onPick(instrument);

    return (
      <StyledInstrumentItem
        onClick={click}
        className={inactive ? 'inactive' : ''}
      >
        <InstrumentListWrapper>{instrument.name}</InstrumentListWrapper>

        <InstrumentListWrapper>
          <InstrumentListNumber
            num={instrument.price}
            accuracy={instrument.accuracy}
          />
        </InstrumentListWrapper>

        <InstrumentListWrapper>
          <InstrumentListNumber
            num={instrument.priceInBase}
            accuracy={instrument.baseAsset.accuracy}
            color={'rgba(245, 246, 247, 0.4)'}
          >
            &nbsp;{instrument.baseAsset.name}
          </InstrumentListNumber>
        </InstrumentListWrapper>

        <InstrumentListWrapper className={'right-align'}>
          <InstrumentListNumber
            num={instrument.change24h}
            accuracy={percentageAccuracy}
            dynamics={instrument.change24h >= 0 ? 'up' : 'down'}
            preSign={instrument.change24h >= 0 ? '+' : ''}
          >
            %
          </InstrumentListNumber>
        </InstrumentListWrapper>

        <InstrumentListWrapper className={'right-align'}>
          <InstrumentListNumber
            num={instrument.volume}
            accuracy={percentageAccuracy}
          >
            &nbsp;{instrument.name.match(/\w*$/i)![0]}
          </InstrumentListNumber>
        </InstrumentListWrapper>
      </StyledInstrumentItem>
    );
  }
);

export default InstrumentListItem;
