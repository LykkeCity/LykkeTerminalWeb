import {connect} from '../connect';
import {withScroll} from '../CustomScrollbar/index';
import WalletBalanceList from './WalletBalanceList';

export interface WalletBalanceListProps {
  assets?: any;
  accuracy: number;
  total: number;
}

export interface WalletBalanceItemProps {
  accuracy: number;
  balance: number;
  id: string;
  reserved: number;
}

const ConnectedWalletBalanceList = withScroll(
  connect(
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
  )
);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {
  default as TradingWalletItem
} from './WalletBalanceItem/WalletBalanceItem';
