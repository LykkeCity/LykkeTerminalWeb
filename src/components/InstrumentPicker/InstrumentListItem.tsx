import {observer} from 'mobx-react';
import * as React from 'react';
import {AssetModel, InstrumentModel} from '../../models/index';
import {formattedNumberWithDashes} from '../../utils/localFormatted/localFormatted';
import {colors} from '../styled';
import {InstrumentListNumber, InstrumentPickerActions} from './index';

interface InstrumentListItemProps extends InstrumentPickerActions {
  baseAsset: AssetModel;
  instrument: InstrumentModel;
  inactive: boolean;
  isAuth: boolean;
}

const InstrumentListItem: React.SFC<InstrumentListItemProps> = observer(
  ({baseAsset, instrument, onPick, inactive, isAuth}) => {
    const percentageAccuracy = 2;
    const click = () => inactive && onPick && onPick(instrument);

    const dynamics =
      (instrument.change24h || 0) === 0
        ? 'zero'
        : (instrument.change24h || 0) > 0 ? 'up' : 'down';
    const sign = (instrument.change24h || 0) > 0 ? '+' : '';

    return (
      <tr onClick={click} className={inactive ? 'inactive' : 'active'}>
        <td title={instrument.displayName}>{instrument.displayName}</td>
        <td>
          <InstrumentListNumber
            num={formattedNumberWithDashes(
              !!instrument.price ? instrument.price : null,
              instrument.accuracy || 0
            )}
            color={!!instrument.price ? colors.white : colors.lightGrey}
          />
        </td>
        <td>
          <InstrumentListNumber
            num={formattedNumberWithDashes(
              !!instrument.change24h ? instrument.change24h : null,
              percentageAccuracy
            )}
            dynamics={dynamics}
            sign={sign}
          >
            {!!instrument.change24h && `%`}
          </InstrumentListNumber>
        </td>
        <td>
          {isAuth ? (
            <InstrumentListNumber
              num={formattedNumberWithDashes(
                !!instrument.volume ? instrument.volume : null,
                instrument.baseAsset.accuracy || 0
              )}
              color={!!instrument.volume ? colors.white : colors.lightGrey}
            >
              {!!instrument.volume && ` ${instrument.baseAsset.name}`}
            </InstrumentListNumber>
          ) : (
            ''
          )}
        </td>
        <td>
          {isAuth ? (
            <InstrumentListNumber
              num={formattedNumberWithDashes(
                !!instrument.volumeInBase ? instrument.volumeInBase : null,
                baseAsset.accuracy || 0
              )}
              color={colors.lightGrey}
            >
              {!!instrument.volumeInBase && ` ${baseAsset.name}`}
            </InstrumentListNumber>
          ) : (
            <InstrumentListNumber
              num={formattedNumberWithDashes(
                !!instrument.volume ? instrument.volume : null,
                instrument.baseAsset.accuracy || 0
              )}
              color={!!instrument.volume ? colors.white : colors.lightGrey}
            >
              {!!instrument.volume && ` ${instrument.baseAsset.name}`}
            </InstrumentListNumber>
          )}
        </td>
      </tr>
    );
  }
);

export default InstrumentListItem;
