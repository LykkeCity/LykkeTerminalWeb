import {observer} from 'mobx-react';
import {AssetModel} from '../../models/index';
import {connect} from '../connect';
import {withScroll} from '../CustomScrollbar';
import WalletBalanceItem from './WalletBalanceItem/WalletBalanceItem';
import WalletBalanceList, {WalletBalanceListProps} from './WalletBalanceList';

const ConnectedWalletBalanceList = connect<WalletBalanceListProps>(
  ({
    balanceListStore: {currentWallet},
    referenceStore: {getAssetById, baseAssetId}
  }) => ({
    wallet: currentWallet,
    assets: currentWallet && currentWallet.balances,
    baseAsset: getAssetById(baseAssetId) || new AssetModel({}),
    getAssetById
  }),
  withScroll(WalletBalanceList)
);

const ObservedWalletBalanceItem = observer(WalletBalanceItem);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {ObservedWalletBalanceItem as WalletBalanceItem};
