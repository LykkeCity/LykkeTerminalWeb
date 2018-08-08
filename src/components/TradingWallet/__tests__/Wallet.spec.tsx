import {mount} from 'enzyme';
import React from 'react';
import {ThemeProvider, themes} from '../../styled';
import Wallet from '../Wallet';

jest.mock('../../WalletBalanceList', () => {
  return {
    WalletBalanceList: () => ''
  };
});

describe('<Wallet>', () => {
  const getTestWallet = () => {
    return (
      <ThemeProvider theme={themes.dark}>
        <Wallet />
      </ThemeProvider>
    );
  };

  it('should render content', () => {
    const wrapper = mount(getTestWallet());
    expect(wrapper.find('WalletContainer')).toHaveLength(1);
    expect(wrapper.find('WalletBalanceList')).toHaveLength(1);
  });
});
