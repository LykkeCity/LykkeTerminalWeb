import {ReferenceStore} from '../../../stores/index';
import {connect} from '../../connect';
import BalanceInfo from './BalanceInfo';

export interface BalanceInfoProps {
  totalBalance: number;
  referenceStore: ReferenceStore;
}

const ConnectedBalanceInfo = connect(
  ({
    referenceStore,
    balanceListStore: {totalBalance: totalBalance},
    uiStore
  }) => ({
    referenceStore,
    totalBalance
  }),
  BalanceInfo
);

export {ConnectedBalanceInfo as BalanceInfo};
