import * as React from 'react';
import AssetStore from '../../stores/assetStore';
import Select from '../Select/select';
import {BalanceInfoProps} from './index';
import './balance-info.css';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
  .Select-control {
    background-color: #333333 !important;

    .Select-value {
      .Select-value-label {
        color: #fff !important;
      }
    }

    .Select-input {
      input {
        color: #fff;
      }
      div {
        background-color: #333333 !important;
        color: #fff !important;
      }
    }
  }

  .Select-menu-outer {
    .Select-option,
    .Select-noresults {
      background-color: #333333 !important;
      color: #fff !important;

      &.is-focused,
      &.is-selected {
        background-color: #666666 !important;
      }
    }
  }
`;

const StyledButton = styled.button`
  background: none;
  outline: none;
  border: none;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

class BalanceInfo extends React.Component<BalanceInfoProps> {
  private readonly assetStore: AssetStore = this.props.assetStore;
  private readonly uiStore = this.props.uiStore;

  documentClickHandler = (e: any) => {
    const target: any = e.target;
    if (target.closest('.Select') || target.id === 'baseAssetBtn') return;
    this.uiStore.toggleAssetsSelect();

    document.body.removeEventListener('click', this.documentClickHandler);
  };

  onClickHandler = () => {
    this.uiStore.toggleAssetsSelect();

    document.body.addEventListener('click', this.documentClickHandler);
  };

  onChangeHandler = (e: any) => {
    if (!e) {
      return;
    }
    this.uiStore.toggleAssetsSelect();
    this.assetStore.setBaseAssetId(e.value);
  };

  getOptions = () => {
    return this.assetStore.allAssets.map(asset => {
      return {
        label: asset.displayId,
        value: asset.id
      };
    });
  };

  render() {
    return (
      <div className={'balance-info'}>
        <span>{this.props.totalBalance}</span>
        <StyledButton onClick={this.onClickHandler} id="baseAssetBtn">
          {this.assetStore.baseAssetId}
        </StyledButton>
        {this.uiStore.showAssetsSelect ? (
          <StyledSelect
            className={'balance-info-select'}
            options={this.getOptions()}
            value={this.assetStore.baseAssetId}
            onChange={this.onChangeHandler}
          />
        ) : null}
      </div>
    );
  }
}

export default BalanceInfo;
