import {mount} from 'enzyme';
import React from 'react';
import {ThemeProvider, themes} from '../../styled';
import ConfirmationWindowSetting from '../ConfirmationWindowSetting';

describe('<ConfirmationWindowSetting>', () => {
  const toggleConfirmations = jest.fn();
  const confirmations = false;

  const getTestConfirmationWindowSetting = () => {
    return (
      <ThemeProvider theme={themes.dark}>
        <ConfirmationWindowSetting
          toggleConfirmations={toggleConfirmations}
          confirmations={confirmations}
        />
      </ThemeProvider>
    );
  };

  it('should render content', () => {
    const wrapper = mount(getTestConfirmationWindowSetting());
    expect(wrapper.find('input[type="checkbox"]')).toHaveLength(1);
  });

  it('should call confirmation callback when user change checkbox state', () => {
    const wrapper = mount(getTestConfirmationWindowSetting());
    wrapper.find('input[type="checkbox"]').simulate('change');
    expect(toggleConfirmations).toHaveBeenCalled();
  });
});
