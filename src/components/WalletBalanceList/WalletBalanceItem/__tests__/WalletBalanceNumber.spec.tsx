import {mount} from 'enzyme';
import React from 'react';
import {AssetBalanceModel} from '../../../../models';
import {ThemeProvider, themes} from '../../../styled';
import WalletBalanceNumber from '../WalletBalanceNumber';

describe('<WalletBalanceList>', () => {
  let onClick: any;
  const assetBalance = new AssetBalanceModel({});
  assetBalance.balance = 1000;
  assetBalance.reserved = 0;
  assetBalance.name = 'USD';
  assetBalance.accuracy = 2;

  beforeEach(() => {
    onClick = jest.fn();
  });

  const getTestWalletBalanceNumber = () => (
    <ThemeProvider theme={themes.dark}>
      <WalletBalanceNumber
        availableBalance={assetBalance.available}
        totalBalance={assetBalance.balance}
        accuracy={assetBalance.accuracy}
        onClick={onClick}
      />
    </ThemeProvider>
  );

  describe('method render', () => {
    it('should render number', () => {
      const wrapper = mount(getTestWalletBalanceNumber());
      expect(wrapper.find('StyledNumber')).toHaveLength(1);
    });

    it('should have clickable class if onClick callback passed', () => {
      const wrapper = mount(getTestWalletBalanceNumber());
      expect(wrapper.find('div.clickable')).toHaveLength(1);
    });

    it('should not have clickable class if onClick callback not passed', () => {
      onClick = null;
      const wrapper = mount(getTestWalletBalanceNumber());
      expect(wrapper.find('div.clickable')).toHaveLength(0);
    });

    it('should call onClick callback after click on number', () => {
      const wrapper = mount(getTestWalletBalanceNumber());
      wrapper.find('StyledNumber').simulate('click');
      expect(onClick).toHaveBeenCalled();
    });
  });
});
