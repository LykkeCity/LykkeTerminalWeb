import {observer} from 'mobx-react';
import {AssetModel} from '../../models/index';
import {connect} from '../connect';
import {withScroll} from '../CustomScrollbar';
import WalletBalanceItem from './WalletBalanceItem';
import WalletBalanceList from './WalletBalanceList';

const ConnectedWalletBalanceList = connect(
  ({
    balanceListStore: {tradingWalletAssets: assets, tradingWalletTotal: total},
    referenceStore,
    referenceStore: {getAssetById, baseAssetId}
  }) => ({
    assets,
    baseAsset: getAssetById(baseAssetId) || new AssetModel({}),
    total,
    getAssetById
  }),
  withScroll(WalletBalanceList)
);

const ObservedWalletBalanceItem = observer(WalletBalanceItem);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {ObservedWalletBalanceItem as WalletBalanceItem};
