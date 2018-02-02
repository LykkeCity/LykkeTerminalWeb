import {AssetBalanceModel} from '../../models/index';
import {connect} from '../connect';
import WalletBalanceList from './WalletBalanceList';

export interface WalletBalanceListProps {
  assets?: any;
  accuracy: number;
  total: number;
}

export interface WalletBalanceItemProps {
  accuracy: number;
  assetBalance: AssetBalanceModel;
}

const ConnectedWalletBalanceList = connect(
  ({
    balanceListStore: {
      tradingWalletAssets: assets,
      totalWalletAssetsBalance: total
    },
    referenceStore
  }) => ({
    accuracy: (referenceStore.getAssetById(referenceStore.baseAssetId) || {
      accuracy: 2
    })!.accuracy,
    assets,
    total
  }),
  WalletBalanceList
);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {
  default as TradingWalletItem
} from './WalletBalanceItem/WalletBalanceItem';
