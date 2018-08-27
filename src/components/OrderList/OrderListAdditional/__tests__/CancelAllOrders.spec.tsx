import {mount} from 'enzyme';
import React from 'react';
import OrdersDefaultSelection from '../../../../models/ordersDefaultSelection';
import CancelAllOrders from '../CancelAllOrders';

describe('<CancelAllOrders>', () => {
  const selectedOrderOptions = OrdersDefaultSelection.CurrentAsset;
  const hasOrders = true;
  let cancelAll = jest.fn();

  const getTestCancelAllOrders = () => {
    return (
      <CancelAllOrders
        cancelAll={cancelAll}
        hasOrders={hasOrders}
        selectedOrderOptions={selectedOrderOptions}
      />
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
    const wrapper = mount(getTestCancelAllOrders());
    wrapper.setProps({hasOrders: false});
    expect(wrapper.find('span').hasClass('clickable')).toEqual(false);
  });

  it('should call cancelAll method with true argument when user click the element and hasOrders set to true', () => {
    const wrapper = mount(getTestCancelAllOrders());
    wrapper.find('span').simulate('click');
    expect(cancelAll).toHaveBeenCalledWith(true);
  });

  it('should call cancelAll method with false argument when user click the element and hasOrders set to true', () => {
    const wrapper = mount(getTestCancelAllOrders());
    wrapper.setProps({selectedOrderOptions: OrdersDefaultSelection.All});
    wrapper.find('span').simulate('click');
    expect(cancelAll).toHaveBeenCalledWith(false);
  });

  it('should not call cancelAll method when user click the element and hasOrders set to false', () => {
    const wrapper = mount(getTestCancelAllOrders());
    cancelAll = jest.fn();
    wrapper.setProps({hasOrders: false});
    wrapper.find('span').simulate('click');
    expect(cancelAll).not.toHaveBeenCalled();
  });
});
