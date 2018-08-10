import * as React from 'react';
import {AssetBalanceModel, InstrumentModel, Side} from '../../models/index';
import WalletModel from '../../models/walletModel';
import {PercentageChangeConfig} from '../../stores/uiOrderStore';
import {WalletBalanceItem} from './index';
import {WalletTable} from './styles';

export interface WalletBalanceListProps {
  wallet: WalletModel;
  selectedInstrument: InstrumentModel | null;
  setSide: (side: string) => void;
  handlePercentageChange: (config: PercentageChangeConfig) => void;
}

const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  wallet,
  selectedInstrument,
  setSide,
  handlePercentageChange
}) => {
  if (!wallet) {
    return null;
  }

  const balances = wallet.balances.filter(
    assetBalance => !!assetBalance.balance
  );

  if (selectedInstrument) {
    balances.sort(first => {
      if (first.name === selectedInstrument.baseAsset.name) {
        return -1;
      } else if (first.name === selectedInstrument.quoteAsset.name) {
        return 0;
      }
      return 1;
    });
  }

  const isBalanceOfBaseAsset = (balanceModel: AssetBalanceModel) =>
    selectedInstrument &&
    balanceModel.name === selectedInstrument.baseAsset.name;

  const isBalanceOfQuoteAsset = (balanceModel: AssetBalanceModel) =>
    selectedInstrument &&
    balanceModel.name === selectedInstrument.quoteAsset.name;

  const isBalanceAvailableInInstrument = (balanceModel: AssetBalanceModel) =>
    isBalanceOfBaseAsset(balanceModel) || isBalanceOfQuoteAsset(balanceModel);

  const updateSide = (balanceModel: AssetBalanceModel) => {
    if (isBalanceOfBaseAsset(balanceModel)) {
      setSide(Side.Sell);
    } else if (isBalanceOfQuoteAsset(balanceModel)) {
      setSide(Side.Buy);
    }
  };

  const setAmount = (balanceModel: AssetBalanceModel) => {
    if (selectedInstrument) {
      handlePercentageChange({
        balance: balanceModel.available,
        baseAssetId: selectedInstrument.baseAsset.id,
        quoteAssetId: selectedInstrument.quoteAsset.id,
        percents: 100
      });
    }
  };

  const onBalanceClick = (balanceModel: AssetBalanceModel) => {
    updateSide(balanceModel);
    setAmount(balanceModel);
  };

  return (
    <WalletTable>
      <tbody>
        {balances.map(assetBalance => (
          <WalletBalanceItem
            key={assetBalance.id}
            assetBalance={assetBalance}
            onClick={
              isBalanceAvailableInInstrument(assetBalance)
                ? () => onBalanceClick(assetBalance)
                : undefined
            }
          />
        ))}
      </tbody>
    </WalletTable>
  );
};

export default WalletBalanceList;
