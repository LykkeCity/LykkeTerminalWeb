import {observer} from 'mobx-react';
import {AssetModel} from '../../models/index';
import {connect} from '../connect';
import {withScroll} from '../CustomScrollbar';
import WalletBalanceItem from './WalletBalanceItem/WalletBalanceItem';
import WalletBalanceList from './WalletBalanceList';

const ConnectedWalletBalanceList = connect(
  ({referenceStore: {getAssetById, baseAssetId}}) => ({
    baseAsset: getAssetById(baseAssetId) || new AssetModel({}),
    getAssetById
  }),
  withScroll(WalletBalanceList)
);

const ObservedWalletBalanceItem = observer(WalletBalanceItem);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {ObservedWalletBalanceItem as WalletBalanceItem};
