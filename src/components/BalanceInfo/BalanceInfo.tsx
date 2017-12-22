import * as React from 'react';
import AssetStore from '../../stores/assetStore';
import Select from '../Select/select';
import {BalanceInfoProps} from './index';

class BalanceInfo extends React.Component<BalanceInfoProps> {
  private readonly assetStore: AssetStore = this.props.assetStore;
  private readonly uiStore = this.props.uiStore;

  onClickHandler = () => {
    this.uiStore.toggleAssetsSelect();
  };

  onChangeHandler = (e: any) => {
    if (!e) {
      return;
    }
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
      <div>
        <span>{this.props.totalBalance}</span>
        <button onClick={this.onClickHandler}>
          {this.assetStore.baseAssetId}
        </button>
        {this.uiStore.showAssetsSelect ? (
          <Select
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
