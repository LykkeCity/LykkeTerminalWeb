import {ReferenceStore, UiStore} from '../../../stores/index';
import {connect} from '../../connect';
import BalanceInfo from './BalanceInfo';

export interface BalanceInfoProps {
  totalBalance: number;
  referenceStore: ReferenceStore;
  uiStore: UiStore;
}

const ConnectedBalanceInfo = connect(
  ({
    referenceStore,
    balanceListStore: {totalBalance: totalBalance},
    uiStore
  }) => ({
    referenceStore,
    totalBalance,
    uiStore
  }),
  BalanceInfo
);

export {ConnectedBalanceInfo as BalanceInfo};
