import {mount} from 'enzyme';
import React from 'react';
import Wallet from '../Wallet';

jest.mock('../../WalletBalanceList', () => {
  return {
    WalletBalanceList: () => ''
  };
});

describe('<Wallet>', () => {
  const getTestWallet = () => {
    return <Wallet />;
  };

  it('should render content', () => {
    const wrapper = mount(getTestWallet());
    expect(wrapper.find('WalletContainer')).toHaveLength(1);
    expect(wrapper.find('WalletBalanceList')).toHaveLength(1);
  });
});
