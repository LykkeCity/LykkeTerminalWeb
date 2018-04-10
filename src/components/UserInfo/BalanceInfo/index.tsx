import {connect} from '../../connect';
import BalanceInfo from './BalanceInfo';

const ConnectedBalanceInfo = connect(
  ({
    referenceStore,
    balanceListStore: {currentWalletTotalBalance},
    uiStore
  }) => ({
    currentWalletTotalBalance,
    referenceStore,
    uiStore
  }),
  BalanceInfo
);

export {ConnectedBalanceInfo as BalanceInfo};
