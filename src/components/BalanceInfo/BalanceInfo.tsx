import * as React from 'react';
import styled from 'styled-components';
import {ReferenceStore, UiStore} from '../../stores';
import ClickOutside from '../ClickOutside/ClickOutside';
import CustomSelect from '../Select/CustomSelect';
import './balance-info.css';
import {BalanceInfoProps} from './index';

const StyledButton = styled.button`
  padding-right: 0;
  background: none;
  outline: none;
  border: none;
  color: #0388ef;

  &:hover {
    cursor: pointer;
  }
`;

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
    return this.referenceStore.allAssets.map(asset => {
      return {
        label: asset.name,
        value: asset.id
      };
    });
  };

  render() {
    return (
      <div className={'balance-info'}>
        <span>
          {this.props.totalBalance.toFixed(
            this.referenceStore.getBaseAssetAccuracy
          )}
        </span>
        <StyledButton onClick={this.handleClick} id="baseAssetBtn">
          {this.referenceStore.baseAssetId}
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
        <div className={'balance-total'}>Total Balance</div>
      </div>
    );
  }
}

export default BalanceInfo;
