import {pathOr} from 'rambda';
import * as React from 'react';
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

  render() {
    return (
      <BalanceInfoDiv>
        <BalanceValue>
          {formattedNumber(
            this.props.totalBalance,
            this.referenceStore.getBaseAssetAccuracy
          )}
        </BalanceValue>
        <BaseAssetLabel>
          {pathOr('', ['getBaseAsset', 'name'], this.referenceStore)}
        </BaseAssetLabel>
        <BalanceLabel className={'balance-total'}>Total Balance</BalanceLabel>
      </BalanceInfoDiv>
    );
  }
}

export default BalanceInfo;
