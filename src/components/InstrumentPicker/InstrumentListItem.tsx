import {observer} from 'mobx-react';
import * as React from 'react';
import {AssetModel, InstrumentModel} from '../../models/index';
import {InstrumentListNumber, InstrumentPickerActions} from './index';

interface InstrumentListItemProps extends InstrumentPickerActions {
  baseAsset: AssetModel;
  instrument: InstrumentModel;
  inactive: boolean;
}

const InstrumentListItem: React.SFC<InstrumentListItemProps> = observer(
  ({baseAsset, instrument, onPick, inactive}) => {
    const percentageAccuracy = 3;
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
        {/*<td>*/}
        {/*<InstrumentListNumber*/}
        {/*num={instrument.priceInBase}*/}
        {/*accuracy={baseAsset.accuracy}*/}
        {/*color={'rgba(245, 246, 247, 0.4)'}*/}
        {/*>*/}
        {/*&nbsp;{baseAsset.name}*/}
        {/*</InstrumentListNumber>*/}
        {/*</td>*/}
        <td>
          <InstrumentListNumber
            num={instrument.change24h}
            accuracy={percentageAccuracy}
            dynamics={instrument.change24h >= 0 ? 'up' : 'down'}
            preSign={instrument.change24h >= 0 ? '+' : ''}
            active={!inactive}
          >
            %
          </InstrumentListNumber>
        </td>
        <td>
          <InstrumentListNumber
            num={instrument.volume}
            accuracy={instrument.quoteAsset.accuracy}
          >
            &nbsp;{instrument.quoteAsset.name}
          </InstrumentListNumber>
        </td>
      </tr>
    );
  }
);

export default InstrumentListItem;
