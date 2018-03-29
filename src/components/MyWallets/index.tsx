import {AssetModel} from '../../models';
import {connect} from '../connect';
import MyWallets, {MyWalletsProps} from './MyWallets';

const ConnectedMyWallets = connect<MyWalletsProps>(
  ({
    balanceListStore: {
      selectWallet,
      getCurrentWallet: currentWallet,
      getWalletsWithPositiveBalances: wallets,
      totalBalance: total,
      tradingWalletTotal: totalTrading
    },
    referenceStore: {getAssetById, baseAssetId}
  }) => ({
    onSelectWallet: selectWallet,
    currentWallet,
    wallets,
    baseAsset: getAssetById(baseAssetId) || new AssetModel({}),
    total,
    totalTrading
  }),
  MyWallets
);

export {ConnectedMyWallets as MyWallets};
export {default as TotalBalance} from './TotalBalance';
export {default as MyWalletNameList} from './MyWallets';
export {default as MyWalletName} from './Name';
