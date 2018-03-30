import {connect} from '../../connect';
import BalanceInfo from './BalanceInfo';

const ConnectedBalanceInfo = connect(
  ({
    referenceStore,
    balanceListStore: {
      getWalletsWithPositiveBalances: balances,
      getCurrentWallet
    },
    uiStore
  }) => ({
    referenceStore,
    balances,
    getCurrentWallet,
    uiStore
  }),
  BalanceInfo
);

export {ConnectedBalanceInfo as BalanceInfo};