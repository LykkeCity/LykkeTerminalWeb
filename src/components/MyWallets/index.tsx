import {AssetModel} from '../../models';
import {connect} from '../connect';
import MyWallets, {MyWalletsProps} from './MyWallets';

const ConnectedMyWallets = connect<MyWalletsProps>(
  ({
    balanceListStore: {
      selectWallet,
      getWalletsWithPositiveBalances: wallets,
      totalBalance: total
    },
    referenceStore: {getAssetById, baseAssetId}
  }) => ({
    onSelectWallet: selectWallet,
    wallets,
    baseAsset: getAssetById(baseAssetId) || new AssetModel({}),
    total
  }),
  MyWallets
);

export {ConnectedMyWallets as MyWallets};
export {default as TotalBalance} from './TotalBalance';
export {default as MyWalletNameList} from './MyWallets';
export {default as MyWalletName} from './Name';
