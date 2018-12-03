import {pathOr} from 'rambda';
import * as React from 'react';
import {AnalyticsEvents} from '../../../constants/analyticsEvents';
import {AnalyticsService} from '../../../services/analyticsService';
import {ReferenceStore} from '../../../stores/index';
import {formattedNumber} from '../../../utils/localFormatted/localFormatted';
import {BalanceInfoProps} from './index';
import {
  BalanceInfoDiv,
  BalanceLabel,
  BalanceValue,
  BaseAssetLabel
} from './styles';

class BalanceInfo extends React.Component<BalanceInfoProps> {
  private readonly referenceStore: ReferenceStore = this.props.referenceStore;

  handleClick = () => {
    AnalyticsService.track(AnalyticsEvents.ClickTotalBalance);
  };

  render() {
    return (
      <BalanceInfoDiv onClick={this.handleClick}>
        <BalanceValue>
          {formattedNumber(
            this.props.getTotalBalanceInBaseAsset(),
            this.referenceStore.getBaseAssetAccuracy
          )}
        </BalanceValue>
        <BaseAssetLabel>
          {pathOr('', ['getBaseAsset', 'name'], this.referenceStore)}
        </BaseAssetLabel>
        <BalanceLabel className={'balance-total'}>Balance</BalanceLabel>
      </BalanceInfoDiv>
    );
  }
}

export default BalanceInfo;
