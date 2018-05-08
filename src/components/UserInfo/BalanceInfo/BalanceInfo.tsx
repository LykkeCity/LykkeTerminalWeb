import {pathOr} from 'rambda';
import * as React from 'react';
import {ReferenceStore, UiStore} from '../../../stores/index';
import {formattedNumber} from '../../../utils/localFormatted/localFormatted';
import ClickOutside from '../../ClickOutside/ClickOutside';
import CustomSelect from '../../Select/CustomSelect';
import {BalanceInfoProps} from './index';
import {BalanceInfoDiv, BalanceLabel, BalanceValue, Button} from './styles';

class BalanceInfo extends React.Component<BalanceInfoProps> {
  private readonly referenceStore: ReferenceStore = this.props.referenceStore;
  private readonly uiStore: UiStore = this.props.uiStore;

  handleClick = () => {
    this.uiStore.toggleAssetsSelect();
  };

  handleChange = () => (value: string) => () => {
    this.referenceStore.setBaseAssetId(value);
    this.uiStore.toggleAssetsSelect();
  };

  getOptions = () => {
    return this.referenceStore.baseAssets
      .map(asset => {
        return {
          label: asset.name,
          value: asset.id
        };
      })
      .sort((a: any, b: any) => (a.label > b.label ? 1 : -1));
  };

  render() {
    return (
      <BalanceInfoDiv>
        <BalanceValue>
          {formattedNumber(
            this.props.totalBalance,
            this.referenceStore.getBaseAssetAccuracy
          )}
        </BalanceValue>
        <Button onClick={this.handleClick} id="baseAssetBtn">
          {pathOr('', ['getBaseAsset', 'name'], this.referenceStore)}
        </Button>
        {this.uiStore.showAssetsSelect ? (
          <ClickOutside onClickOutside={this.uiStore.toggleAssetsSelect}>
            <CustomSelect
              styles={{
                height: '300px',
                minWidth: '150px',
                right: '0',
                top: '40px'
              }}
              items={this.getOptions()}
              click={this.handleChange()}
              needScroll={true}
              isActiveMarked={true}
              activeValue={pathOr(
                '',
                ['getBaseAsset', 'id'],
                this.referenceStore
              )}
            />
          </ClickOutside>
        ) : null}
        <BalanceLabel className={'balance-total'}>Total Balance</BalanceLabel>
      </BalanceInfoDiv>
    );
  }
}

export default BalanceInfo;
