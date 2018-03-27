import {AssetModel} from '../../models';
import {connect} from '../connect';
import MyWallets from './MyWallets';

const connectedMyWallets = connect(
  ({
    balanceListStore: {totalBalance: total, tradingWalletTotal: totalTrading},
    referenceStore
  }) => ({
    baseAsset:
      referenceStore.getAssetById(referenceStore.baseAssetId) ||
      new AssetModel({}),
    total,
    totalTrading
  }),
  MyWallets
);

export {connectedMyWallets as MyWallets};
export {default as TotalBalance} from './TotalBalance';
export {default as MyWalletNameList} from './MyWallets';
export {default as MyWalletName} from './Name';
