import {rem} from 'polished';
import {pathOr} from 'rambda';
import * as React from 'react';
import styled from 'styled-components';
import {ReferenceStore, UiStore} from '../../../stores/index';
import ClickOutside from '../../ClickOutside/ClickOutside';
import CustomSelect from '../../Select/CustomSelect';

const StyledBalanceInfo = styled.div`
  text-align: right;
  padding-right: ${rem(15)};
`;

const StyledBalanceValue = styled.span`
  color: #f5f6f7;
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(16)};
  font-weight: bold;
  line-height: 1;
  text-align: left;
`;

const StyledButton = styled.button`
  background: none;
  border: none;
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(16)};
  font-weight: bold;
  line-height: 1;
  text-align: right;
  color: #0388ef;
  padding-right: 0;
  outline: none;
  &:hover {
    cursor: pointer;
  }
`;

const StyledBalanceLabel = styled.div`
  color: #8c94a0;
  font-size: 0.7rem;
`;

interface BalanceInfoProps {
  balances: any[];
  getCurrentWallet: any;
  referenceStore: ReferenceStore;
  uiStore: UiStore;
}

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
      <StyledBalanceInfo>
        <StyledBalanceValue>
          {(this.props.balances[this.props.getCurrentWallet]
            ? this.props.balances[this.props.getCurrentWallet].totalBalance
            : 0
          ).toFixed(this.referenceStore.getBaseAssetAccuracy)}
        </StyledBalanceValue>
        <StyledButton onClick={this.handleClick} id="baseAssetBtn">
          {pathOr('', ['getBaseAsset', 'name'], this.referenceStore)}
        </StyledButton>
        {this.uiStore.showAssetsSelect ? (
          <ClickOutside onClickOutside={this.uiStore.toggleAssetsSelect}>
            <CustomSelect
              styles={{
                height: '300px',
                minWidth: '150px',
                right: '40px',
                top: '40px'
              }}
              items={this.getOptions()}
              click={this.handleChange()}
            />
          </ClickOutside>
        ) : null}
        <StyledBalanceLabel className={'balance-total'}>
          Total Balance
        </StyledBalanceLabel>
      </StyledBalanceInfo>
    );
  }
}

export default BalanceInfo;
