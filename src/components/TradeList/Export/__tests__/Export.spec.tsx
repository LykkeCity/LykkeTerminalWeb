import {mount, render} from 'enzyme';
import React from 'react';
import {UserInfoModel} from '../../../../models';
import Export from '../Export';

describe('<Export>', () => {
  const userInfo = new UserInfoModel({
    email: 'wow@so.much',
    firstName: 'Doge',
    lastName: 'Sych',
    kycStatus: 'Ok'
  });
  const fetchCsvUrl = jest.fn();
  let canExport = jest.fn(() => true);

  // tslint:disable-next-line:no-shadowed-variable
  const getExportButton = (canExport: () => boolean) => {
    return (
      <Export
        canExport={canExport}
        fetchCsvUrl={fetchCsvUrl}
        userInfo={userInfo}
      />
    );
  };

  it('should render content', () => {
    const wrapper = mount(getExportButton(canExport));
    expect(wrapper.find('Export')).toHaveLength(1);
  });

  it('should be disabled if cannot export', () => {
    canExport = jest.fn(() => false);
    const wrapper = render(getExportButton(canExport));
    expect(wrapper.find('Export').hasClass('clickable')).toBeFalsy();
  });

  it('should have proper title', () => {
    const title = 'Export history (csv)';
    const wrapper = mount(getExportButton(canExport));
    expect(wrapper.find('Export').text()).toEqual(title);
  });
});
