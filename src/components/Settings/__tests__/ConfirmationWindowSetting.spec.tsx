import {mount, shallow} from 'enzyme';
import React from 'react';

import ConfirmationWindowSetting from '../ConfirmationWindowSetting';

describe('<ConfirmationWindowSetting>', () => {
  const toggleConfirmations = jest.fn();
  const confirmations = false;

  const getTestConfirmationWindowSetting = () => {
    return (
      <ConfirmationWindowSetting
        toggleConfirmations={toggleConfirmations}
        confirmations={confirmations}
      />
    );
  };

  it('should render content', () => {
    const wrapper = shallow(getTestConfirmationWindowSetting());
    expect(wrapper.find('CustomCheckbox')).toHaveLength(1);
  });

  it('should call confirmation callback when user change checkbox state', () => {
    const wrapper = mount(getTestConfirmationWindowSetting());
    wrapper
      .find('CustomCheckbox')
      .find('input[type="checkbox"]')
      .simulate('change');
    expect(toggleConfirmations).toHaveBeenCalled();
  });
});
