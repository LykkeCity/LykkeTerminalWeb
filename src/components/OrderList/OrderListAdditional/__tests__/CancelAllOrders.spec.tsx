import {mount} from 'enzyme';
import React from 'react';
import OrdersDefaultSelection from '../../../../models/ordersDefaultSelection';
import {ThemeProvider, themes} from '../../../styled';
import CancelAllOrders from '../CancelAllOrders';

describe('<CancelAllOrders>', () => {
  let cancelAll = jest.fn();

  const getTestCancelAllOrders = (
    options: any = {
      selectedOrderOptions: OrdersDefaultSelection.CurrentAsset,
      hasOrders: true
    }
  ) => {
    cancelAll = jest.fn();

    return (
      <ThemeProvider theme={themes.dark}>
        <CancelAllOrders
          cancelAll={cancelAll}
          hasOrders={options.hasOrders}
          selectedOrderOptions={options.selectedOrderOptions}
        />
      </ThemeProvider>
    );
  };

  it('should render content', () => {
    const wrapper = mount(getTestCancelAllOrders());
    expect(wrapper.find('span')).toHaveLength(1);
  });

  it('should add .clickable class to span when hasOrders set to true', () => {
    const wrapper = mount(getTestCancelAllOrders());
    expect(wrapper.find('span').hasClass('clickable')).toEqual(true);
  });

  it('should not add .clickable class to span when hasOrders set to false', () => {
    const wrapper = mount(getTestCancelAllOrders({hasOrders: false}));
    expect(wrapper.find('span').hasClass('clickable')).toEqual(false);
  });

  it('should call cancelAll method with true argument when user click the element and hasOrders set to true', () => {
    const wrapper = mount(getTestCancelAllOrders());
    wrapper.find('span').simulate('click');
    expect(cancelAll).toHaveBeenCalledWith(true);
  });

  it('should call cancelAll method with false argument when user click the element and hasOrders set to true', () => {
    const wrapper = mount(
      getTestCancelAllOrders({
        selectedOrderOptions: OrdersDefaultSelection.All,
        hasOrders: true
      })
    );
    wrapper.find('span').simulate('click');
    expect(cancelAll).toHaveBeenCalledWith(false);
  });

  it('should not call cancelAll method when user click the element and hasOrders set to false', () => {
    const wrapper = mount(getTestCancelAllOrders({hasOrders: false}));
    cancelAll = jest.fn();
    wrapper.find('span').simulate('click');
    expect(cancelAll).not.toHaveBeenCalled();
  });
});
