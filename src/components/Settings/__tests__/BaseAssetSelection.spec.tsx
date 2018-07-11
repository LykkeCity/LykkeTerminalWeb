import {mount} from 'enzyme';
import React from 'react';

import {AssetModel} from '../../../models';
import {ReferenceStore, RootStore} from '../../../stores';
import {CustomDropdownProps} from '../../CustomDropdown/CustomDropdown';
import BaseAssetSelection from '../BaseAssetSelection';

describe('<BaseAssetSelection>', () => {
  let referenceStore: ReferenceStore;
  const api: any = {
    fetchAll: jest.fn(),
    fetchAssetCategories: jest.fn(),
    fetchAssetInstruments: jest.fn(),
    fetchBaseAsset: jest.fn()
  };

  beforeEach(() => {
    referenceStore = new ReferenceStore(new RootStore(true), api);
    const lkkAsset = new AssetModel({
      id: '1',
      name: 'LKK',
      canBeBase: true
    });
    const bccAsset = new AssetModel({
      id: '2',
      name: 'BCC',
      canBeBase: true
    });
    referenceStore.addAsset(lkkAsset);
    referenceStore.addAvailableAsset('1');
    referenceStore.addAsset(bccAsset);
    referenceStore.addAvailableAsset('2');
  });

  const getTestBaseAssetSelection = () => {
    return <BaseAssetSelection referenceStore={referenceStore} />;
  };

  it('should render content', () => {
    const wrapper = mount(getTestBaseAssetSelection());
    expect(wrapper.find('CustomDropdown')).toHaveLength(1);
  });

  it('should render items in alphabet order', () => {
    const wrapper = mount(getTestBaseAssetSelection());
    const options = (wrapper.find('CustomDropdown').props() as Partial<
      CustomDropdownProps
    >).items;
    expect(options!.map(item => item.label)).toEqual(['BCC', 'LKK']);
  });

  it('should call setBaseAssetId method from reference store when user change selected asset', () => {
    const wrapper = mount(getTestBaseAssetSelection());

    referenceStore.setBaseAssetId = jest.fn();

    wrapper
      .find('CustomDropdown')
      .find('li')
      .last()
      .simulate('click');
    expect(referenceStore.setBaseAssetId).toHaveBeenCalledWith('1');
  });
});
