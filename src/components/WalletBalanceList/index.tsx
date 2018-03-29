import {AssetModel} from '../../models/index';
import {connect} from '../connect';
import WalletBalanceList from './WalletBalanceList';

const ConnectedWalletBalanceList = connect(
  ({
    balanceListStore: {tradingWalletAssets: assets, tradingWalletTotal: total},
    referenceStore,
    referenceStore: {getAssetById: getAssetById}
  }) => ({
    assets,
    baseAsset:
      referenceStore.getAssetById(referenceStore.baseAssetId) ||
      new AssetModel({}),
    total,
    getAssetById
  }),
  WalletBalanceList
);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {
  default as TradingWalletItem
} from './WalletBalanceItem/WalletBalanceItem';
