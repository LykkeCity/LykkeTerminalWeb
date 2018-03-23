import {AssetBalanceModel, AssetModel} from '../../models/index';
import {connect} from '../connect';
import {withScroll} from '../CustomScrollbar';
import WalletBalanceList from './WalletBalanceList';

export interface WalletBalanceItemProps {
  assetBalance: AssetBalanceModel;
  baseAsset: AssetModel;
}

const ConnectedWalletBalanceList = connect(
  ({
    balanceListStore: {tradingWalletAssets: assets, tradingWalletTotal: total},
    referenceStore
  }) => ({
    assets,
    baseAsset:
      referenceStore.getAssetById(referenceStore.baseAssetId) ||
      new AssetModel({}),
    total
  }),
  withScroll(WalletBalanceList)
);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {
  default as TradingWalletItem
} from './WalletBalanceItem/WalletBalanceItem';
