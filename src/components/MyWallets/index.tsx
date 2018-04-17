import {compose, curry} from 'rambda';
import {AssetModel} from '../../models';
import {withAuth} from '../Auth';
import {connect} from '../connect';
import MyWallets, {MyWalletsProps} from './MyWallets';
import WalletItem, {WalletItemProps} from './Name';
import WalletList, {WalletListProps} from './NameList';
import TotalBalance, {TotalBalanceProps} from './TotalBalance';

const toLocaleWithAccuracy = (accuracy: number, num: number) =>
  num.toLocaleString(undefined, {
    maximumFractionDigits: accuracy
  });

const toNumberOrNoop = (num: number | undefined) => num || '';

const withName = (name: string, num: string) => num.concat(' ', name);

const formatBalance = (baseAsset: AssetModel, balance: number) =>
  compose(
    curry(withName)(baseAsset.name),
    curry(toLocaleWithAccuracy)(baseAsset.accuracy),
    toNumberOrNoop
  )(balance);

export interface WalletActions {
  onChangeWallet: (walletId: string) => void;
}

const ConnectedMyWallets = connect<MyWalletsProps>(
  ({
    balanceListStore: {
      getWalletsWithPositiveBalances: wallets,
      totalBalance: total,
      currentWallet
    },
    referenceStore: {getAssetById, baseAssetId},
    authStore: {isAuth}
  }) => ({
    wallets,
    currentWallet,
    baseAsset: getAssetById(baseAssetId) || new AssetModel({}),
    total,
    isAuth
  }),
  withAuth(MyWallets)
);

const ConnectedWalletList = connect<WalletListProps>(
  ({balanceListStore: {getWalletsWithPositiveBalances}}) => ({
    wallets: getWalletsWithPositiveBalances
  }),
  WalletList
);

const ConnectedWalletItem = connect<WalletItemProps>(
  ({
    balanceListStore: {currentWallet, changeWallet},
    referenceStore: {getAssetById, baseAssetId}
  }) => ({
    selectedId: currentWallet && currentWallet.id,
    onChangeWallet: changeWallet,
    baseAsset: getAssetById(baseAssetId) || new AssetModel({}),
    formatBalance
  }),
  WalletItem
);

const ConnectedTotalBalance = connect<TotalBalanceProps>(
  ({
    balanceListStore: {totalBalance},
    referenceStore: {getAssetById, baseAssetId}
  }) => ({
    total: totalBalance,
    baseAsset: getAssetById(baseAssetId) || new AssetModel({}),
    formatBalance
  }),
  TotalBalance
);

export {ConnectedMyWallets as MyWallets};
export {ConnectedWalletList as WalletList};
export {ConnectedWalletItem as WalletItem};
export {ConnectedTotalBalance as TotalBalance};

export {default as MyWalletNameList} from './MyWallets';
