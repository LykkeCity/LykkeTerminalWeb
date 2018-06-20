import {mount} from 'enzyme';
import React from 'react';

import CustomDropdown from '../CustomDropdown';

describe('<CustomDropdown>', () => {
  const controlButtonName = 'Test';
  const getItems = () => [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'}
  ];
  const selectedValue = getItems()[0].value;
  const onClick = jest.fn();

  const getTestCustomDropdown = () => {
    return (
      <CustomDropdown
        controlButtonName={controlButtonName}
        items={getItems()}
        selectedValue={selectedValue}
        onClick={onClick}
      />
    );
  };

  it('should render content', () => {
    const wrapper = mount(getTestCustomDropdown());
    expect(wrapper.find('CustomDropdown')).toHaveLength(1);
  });

  it('should render all items', () => {
    const wrapper = mount(getTestCustomDropdown());
    expect(wrapper.find('.dropdown-list__item')).toHaveLength(3);
  });

  it('should call callback when user select last option', () => {
    const wrapper = mount(getTestCustomDropdown());
    wrapper
      .find('.dropdown-list__item')
      .last()
      .simulate('click');
    expect(onClick).toHaveBeenCalledWith('3');
  });

  it('should change state when user click on control button', () => {
    const wrapper = mount(getTestCustomDropdown());
    const controlButton = wrapper.find('.dropdown__control');
    expect(wrapper.state().isOpened).toBe(false);
    controlButton.simulate('click');
    expect(wrapper.state().isOpened).toBe(true);
    controlButton.simulate('click');
    expect(wrapper.state().isOpened).toBe(false);
  });
});
