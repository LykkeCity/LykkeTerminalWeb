import * as React from 'react';
import styled from 'styled-components';
import {ReferenceStore, UiStore} from '../../stores';
import Select from '../Select/Select';
import './balance-info.css';
import {BalanceInfoProps} from './index';

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

  handleChange = (e: any) => {
    if (!e) {
      return;
    }
    this.referenceStore.setBaseAssetId(e.value);
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
          <StyledSelect
            btnId={'baseAssetBtn'}
            toggleSelect={this.uiStore.toggleAssetsSelect}
            className={'balance-info-select'}
            options={this.getOptions()}
            value={this.referenceStore.baseAssetId}
            onChange={this.handleChange}
          />
        ) : null}
        <div className={'balance-total'}>Total Balance</div>
      </div>
    );
  }
}

export default BalanceInfo;
