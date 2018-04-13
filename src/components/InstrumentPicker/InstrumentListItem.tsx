import {observer} from 'mobx-react';
import * as React from 'react';
import {AssetModel, InstrumentModel} from '../../models/index';
import {colors} from '../styled';
import {InstrumentListNumber, InstrumentPickerActions} from './index';

interface InstrumentListItemProps extends InstrumentPickerActions {
  baseAsset: AssetModel;
  instrument: InstrumentModel;
  inactive: boolean;
}

const InstrumentListItem: React.SFC<InstrumentListItemProps> = observer(
  ({baseAsset, instrument, onPick, inactive}) => {
    const percentageAccuracy = 2;
    const click = () => inactive && onPick && onPick(instrument);

    return (
      <tr onClick={click} className={inactive ? 'inactive' : 'active'}>
        <td>{instrument.displayName}</td>
        <td>
          <InstrumentListNumber
            num={instrument.price}
            accuracy={instrument.accuracy}
          />
        </td>
        <td>
          <InstrumentListNumber
            num={instrument.change24h}
            accuracy={percentageAccuracy}
            dynamics={instrument.change24h >= 0 ? 'up' : 'down'}
            preSign={instrument.change24h >= 0 ? '+' : ''}
          >
            %
          </InstrumentListNumber>
        </td>
        <td>
          <InstrumentListNumber
            num={instrument.volume}
            accuracy={instrument.baseAsset.accuracy}
          >
            &nbsp;{instrument.baseAsset.name}
          </InstrumentListNumber>
        </td>
        <td>
          <InstrumentListNumber
            num={instrument.volumeInBase}
            accuracy={baseAsset.accuracy}
            color={colors.lightGrey}
          >
            &nbsp;{baseAsset.name}
          </InstrumentListNumber>
        </td>
      </tr>
    );
  }
);

export default InstrumentListItem;
