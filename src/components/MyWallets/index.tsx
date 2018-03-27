import {AssetModel} from '../../models';
import {connect} from '../connect';
import MyWallets from './MyWallets';

const connectedMyWallets = connect(
  ({balanceListStore: {tradingWalletTotal: total}, referenceStore}) => ({
    baseAsset:
      referenceStore.getAssetById(referenceStore.baseAssetId) ||
      new AssetModel({}),
    total
  }),
  MyWallets
);

export {connectedMyWallets as MyWallets};
export {default as TotalBalance} from './TotalBalance';
export {default as MyWalletNameList} from './MyWallets';
export {default as MyWalletName} from './Name';
