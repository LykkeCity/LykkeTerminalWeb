import {connect} from '../connect';
import WalletBalanceList from './WalletBalanceList';

export interface WalletBalanceListProps {
  assets?: any;
  accuracy: number;
}

export interface WalletBalanceItemProps {
  accuracy: number;
  balance: number;
  id: string;
  reserved: number;
}

const ConnectedWalletBalanceList = connect(
  ({balanceListStore: {tradingWalletAssets: assets}, referenceStore}) => ({
    accuracy: (referenceStore.getAssetById(referenceStore.baseAssetId) || {
      accuracy: 2
    })!.accuracy,
    assets
  }),
  WalletBalanceList
);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {
  default as TradingWalletItem
} from './WalletBalanceItem/WalletBalanceItem';
