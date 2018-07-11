import {mount, shallow} from 'enzyme';
import React from 'react';
import {
  AssetBalanceModel,
  AssetModel,
  InstrumentModel,
  Side,
  WalletModel
} from '../../../models';
import WalletBalanceList from '../WalletBalanceList';

jest.mock('../index', () => ({
  WalletBalanceItem: () => null
}));

describe('<WalletBalanceList>', () => {
  const baseAsset = new AssetModel({
    id: 'USD',
    name: 'USD'
  });
  const quoteAsset = new AssetModel({
    id: 'ETC',
    name: 'ETC'
  });
  const selectedInstrument = new InstrumentModel({
    baseAsset,
    quoteAsset
  });

  let wallet: any;
  let setSide: any;
  let handlePercentageChange: any;

  const getTestWalletBalanceList = () => (
    <WalletBalanceList
      wallet={wallet}
      selectedInstrument={selectedInstrument}
      setSide={setSide}
      handlePercentageChange={handlePercentageChange}
    />
  );

  beforeEach(() => {
    setSide = jest.fn();
    handlePercentageChange = jest.fn();

    wallet = new WalletModel({
      Id: 'Trading',
      Name: 'Trading',
      Balances: [
        {AssetId: 'USD', Balance: 2000, Reserved: 0},
        {AssetId: 'ETC', Balance: 3000, Reserved: 0},
        {AssetId: 'BTC', Balance: 5000, Reserved: 0}
      ],
      Type: 'Trading'
    });
    wallet.balances = wallet.balances.map((balance: AssetBalanceModel) => {
      return {
        name: balance.id,
        ...balance
      };
    });
  });

  describe('method render', () => {
    it('not should render table if wallet is not available', () => {
      wallet = null;

      const wrapper = shallow(getTestWalletBalanceList());
      expect(wrapper.find('WalletTable')).toHaveLength(0);
    });

    it('should render table', () => {
      const wrapper = shallow(getTestWalletBalanceList());
      expect(wrapper.find('WalletTable')).toHaveLength(1);
    });

    it('should render all available balances', () => {
      const wrapper = mount(getTestWalletBalanceList());
      expect(wrapper.find('WalletBalanceItem')).toHaveLength(3);
    });

    it('should render base asset as a first item', () => {
      const wrapper = mount(getTestWalletBalanceList());
      const baseAssetBalanceItemProps = wrapper
        .find('WalletBalanceItem')
        .first()
        .props() as any;
      expect(baseAssetBalanceItemProps.assetBalance.id).toBe(baseAsset.id);
    });

    it('should render quote asset as a second item', () => {
      const wrapper = mount(getTestWalletBalanceList());
      const quoteAssetBalanceItemProps = wrapper
        .find('WalletBalanceItem')
        .at(1)
        .props() as any;
      expect(quoteAssetBalanceItemProps.assetBalance.id).toBe(quoteAsset.id);
    });

    it('should not render non-base and non-quote asset at the beginning of the list', () => {
      const wrapper = mount(getTestWalletBalanceList());
      const quoteAssetBalanceItemProps = wrapper
        .find('WalletBalanceItem')
        .last()
        .props() as any;
      expect(quoteAssetBalanceItemProps.assetBalance.id).not.toBe(baseAsset.id);
      expect(quoteAssetBalanceItemProps.assetBalance.id).not.toBe(
        quoteAsset.id
      );
    });
  });

  describe('method onBalanceClick', () => {
    it('should set sell side after click on base asset balance', () => {
      const wrapper = mount(getTestWalletBalanceList());
      const baseAssetBalanceItemProps = wrapper
        .find('WalletBalanceItem')
        .first()
        .props() as any;
      baseAssetBalanceItemProps.onClick();
      expect(setSide).toHaveBeenCalledWith(Side.Sell);
    });

    it('should set buy side after click on quote asset balance', () => {
      const wrapper = mount(getTestWalletBalanceList());
      const quoteAssetBalanceItemProps = wrapper
        .find('WalletBalanceItem')
        .at(1)
        .props() as any;
      quoteAssetBalanceItemProps.onClick();
      expect(setSide).toHaveBeenCalledWith(Side.Buy);
    });

    it('should update amount on click', () => {
      const wrapper = mount(getTestWalletBalanceList());
      const quoteAssetBalanceItemProps = wrapper
        .find('WalletBalanceItem')
        .first()
        .props() as any;
      quoteAssetBalanceItemProps.onClick();
      expect(handlePercentageChange).toHaveBeenCalled();
    });
  });
});
