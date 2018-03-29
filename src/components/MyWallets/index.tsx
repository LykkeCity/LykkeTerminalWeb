import {AssetModel} from '../../models';
import {connect} from '../connect';
import MyWallets from './MyWallets';

const connectedMyWallets = connect(
  ({
    balanceListStore: {
      setNewCurrentWallet: setNewCurrentWallet,
      getCurrentWallet: currentWallet,
      getBalances: balances,
      totalBalance: total,
      tradingWalletTotal: totalTrading
    },
    referenceStore: {getAssetById: getAssetById},
    referenceStore
  }) => ({
    setNewCurrentWallet,
    currentWallet,
    balances,
    baseAsset:
      referenceStore.getAssetById(referenceStore.baseAssetId) ||
      new AssetModel({}),
    total,
    totalTrading,
    getAssetById
  }),
  MyWallets
);

export {connectedMyWallets as MyWallets};
export {default as TotalBalance} from './TotalBalance';
export {default as MyWalletNameList} from './MyWallets';
export {default as MyWalletName} from './Name';
