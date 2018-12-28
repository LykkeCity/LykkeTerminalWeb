import * as React from 'react';
import {AssetBalanceModel, InstrumentModel, Side} from '../../models/index';
import WalletModel from '../../models/walletModel';
import {WalletBalanceItem} from './index';
import {WalletTable} from './styles';

export interface WalletBalanceListProps {
  wallet: WalletModel;
  selectedInstrument: InstrumentModel | null;
  setSide: (side: string) => void;
  setAmount: (amount: number) => void;
}

const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  wallet,
  selectedInstrument,
  setSide,
  setAmount
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

  const updateAmount = (balanceModel: AssetBalanceModel) => {
    if (selectedInstrument && isBalanceOfBaseAsset(balanceModel)) {
      setAmount(balanceModel.available);
    }
  };

  const onBalanceClick = (balanceModel: AssetBalanceModel) => {
    updateSide(balanceModel);
    updateAmount(balanceModel);
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
