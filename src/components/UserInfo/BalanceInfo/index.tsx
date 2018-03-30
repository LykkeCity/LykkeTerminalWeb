import {connect} from '../../connect';
import BalanceInfo from './BalanceInfo';

const ConnectedBalanceInfo = connect(
  ({referenceStore, balanceListStore: {getCurrentWalletModel}, uiStore}) => ({
    getCurrentWalletModel,
    referenceStore,
    uiStore
  }),
  BalanceInfo
);

export {ConnectedBalanceInfo as BalanceInfo};
