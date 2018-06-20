import {pathOr} from 'rambda';
import React from 'react';
import {ReferenceStore} from '../../stores/index';
import {CustomDropdown} from '../CustomDropdown';
import {ListItem} from '../CustomDropdown/CustomDropdown';

interface BaseAssetSelectionProps {
  referenceStore: ReferenceStore;
}

class BaseAssetSelection extends React.Component<BaseAssetSelectionProps> {
  private readonly referenceStore: ReferenceStore = this.props.referenceStore;

  constructor(props: BaseAssetSelectionProps) {
    super(props);
  }

  handleAssetChange = (value: string) => {
    this.referenceStore.setBaseAssetId(value);
  };

  getAssetOptions = () => {
    return this.referenceStore.baseAssets
      .map(asset => {
        return {
          label: asset.name,
          value: asset.id
        };
      })
      .sort((a: ListItem, b: ListItem) => (a.label > b.label ? 1 : -1));
  };

  getSelectedBaseAssetParam = (parameterName: string) => {
    return pathOr('', ['getBaseAsset', parameterName], this.referenceStore);
  };

  render() {
    return (
      <CustomDropdown
        controlButtonName={this.getSelectedBaseAssetParam('name')}
        items={this.getAssetOptions()}
        selectedValue={this.getSelectedBaseAssetParam('id')}
        onClick={this.handleAssetChange}
      />
    );
  }
}

export default BaseAssetSelection;
