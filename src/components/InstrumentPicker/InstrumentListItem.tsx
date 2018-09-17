import {observer} from 'mobx-react';
import * as React from 'react';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import {AssetModel, InstrumentModel} from '../../models/index';
import {AnalyticsService} from '../../services/analyticsService';
import {formattedNumberWithDashes} from '../../utils/localFormatted/localFormatted';
import {ThemeObject} from '../styled';
import {InstrumentListNumber, InstrumentPickerActions} from './index';

interface InstrumentListItemProps extends InstrumentPickerActions {
  baseAsset: AssetModel;
  instrument: InstrumentModel;
  inactive: boolean;
  isAuth: boolean;
  theme: ThemeObject;
}

const InstrumentListItem: React.SFC<InstrumentListItemProps> = observer(
  ({baseAsset, instrument, onPick, inactive, isAuth, theme}) => {
    const percentageAccuracy = 2;
    const click = () => {
      if (inactive && onPick) {
        AnalyticsService.track(AnalyticsEvents.SelectInstrument(instrument));
        onPick(instrument);
      }
    };

    const dynamics =
      (instrument.change24h || 0) === 0
        ? 'zero'
        : (instrument.change24h || 0) > 0
          ? 'up'
          : 'down';
    const sign = (instrument.change24h || 0) > 0 ? '+' : '';
    const themeColors = theme.colors;

    return (
      <tr onClick={click} className={inactive ? 'inactive' : 'active'}>
        <td title={instrument.displayName}>{instrument.displayName}</td>
        <td>
          <InstrumentListNumber
            num={formattedNumberWithDashes(
              instrument.price || null,
              instrument.accuracy || 0
            )}
            color={
              !!instrument.price
                ? themeColors.text
                : themeColors.numberNonPriceText
            }
          />
        </td>
        <td>
          <InstrumentListNumber
            num={formattedNumberWithDashes(
              instrument.change24h || null,
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
                instrument.volume || null,
                instrument.baseAsset.accuracy || 0
              )}
              color={
                !!instrument.volume
                  ? themeColors.text
                  : themeColors.numberNonPriceText
              }
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
                instrument.volumeInBase || null,
                baseAsset.accuracy || 0
              )}
              color={themeColors.instrumentVolumeText}
            >
              {!!instrument.volumeInBase && ` ${baseAsset.name}`}
            </InstrumentListNumber>
          ) : (
            <InstrumentListNumber
              num={formattedNumberWithDashes(
                instrument.volume || null,
                instrument.baseAsset.accuracy || 0
              )}
              color={
                !!instrument.volume
                  ? themeColors.text
                  : themeColors.numberNonPriceText
              }
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
