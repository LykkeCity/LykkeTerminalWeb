import {mount} from 'enzyme';
import React from 'react';

import UserInfoModel from '../../../models/userInfoModel';
import UserName from '../UserName';

describe('<UserName>', () => {
  const getUserInfo = jest.fn(
    () => new UserInfoModel({FirstName: 'First', LastName: 'Second'})
  );

  const getTestUserName = () => {
    return <UserName getUserInfo={getUserInfo} />;
  };

  it('should render content', () => {
    const wrapper = mount(getTestUserName());
    expect(wrapper.find('UserName')).toHaveLength(1);
  });

  it('should show full name', () => {
    const wrapper = mount(getTestUserName());
    expect(wrapper.text()).toBe('First Second');
  });

  it('should not render content if no user info presented', () => {
    getUserInfo.mockReturnValue(null);

    const wrapper = mount(getTestUserName());
    expect(wrapper.html()).toBe(null);
  });
});
