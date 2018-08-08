import {mount} from 'enzyme';
import React from 'react';
import {ThemeProvider} from 'styled-components';
import {AssetBalanceModel} from '../../../../models';
import {themes} from '../../../styled';
import WalletBalanceItem from '../WalletBalanceItem';

describe('<WalletBalanceList>', () => {
  let onClick: any;
  const assetBalance = new AssetBalanceModel({});
  assetBalance.balance = 1000;
  assetBalance.reserved = 0;
  assetBalance.name = 'USD';
  assetBalance.accuracy = 2;

  const getTestWalletBalanceItem = () => (
    <ThemeProvider theme={themes.dark}>
      <table>
        <tbody>
          <WalletBalanceItem assetBalance={assetBalance} onClick={onClick} />
        </tbody>
      </table>
    </ThemeProvider>
  );

  beforeEach(() => {
    onClick = jest.fn();
  });

  describe('method render', () => {
    it('should render table row', () => {
      const wrapper = mount(getTestWalletBalanceItem());
      expect(wrapper.find('tr')).toHaveLength(1);
    });

    it('should render asset name in first cell', () => {
      const wrapper = mount(getTestWalletBalanceItem());
      expect(
        wrapper
          .find('Cell')
          .at(0)
          .text()
      ).toBe(assetBalance.name);
    });

    it('should render asset balance in second cell', () => {
      const wrapper = mount(getTestWalletBalanceItem());
      const balanceText = wrapper
        .find('Cell')
        .at(1)
        .text();
      expect(balanceText).toContain('1,000.00');
      expect(balanceText).toContain('USD');
    });

    it('should pass arguments into WalletBalanceNumber', () => {
      const wrapper = mount(getTestWalletBalanceItem());
      const balanceNumberProps = wrapper
        .find('WalletBalanceNumber')
        .props() as any;
      expect(balanceNumberProps.availableBalance).toBe(assetBalance.available);
      expect(balanceNumberProps.totalBalance).toBe(assetBalance.balance);
      expect(balanceNumberProps.accuracy).toBe(assetBalance.accuracy);
      expect(balanceNumberProps.onClick).toBe(onClick);
    });
  });
});
