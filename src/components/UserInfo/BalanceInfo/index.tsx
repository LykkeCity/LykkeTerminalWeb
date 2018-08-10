import {ReferenceStore} from '../../../stores/index';
import {connect} from '../../connect';
import BalanceInfo from './BalanceInfo';

export interface BalanceInfoProps {
  getTotalBalanceInBaseAsset: () => number;
  referenceStore: ReferenceStore;
}

const ConnectedBalanceInfo = connect(
  ({referenceStore, balanceListStore: {getTotalBalanceInBaseAsset}}) => ({
    referenceStore,
    getTotalBalanceInBaseAsset
  }),
  BalanceInfo
);

export {ConnectedBalanceInfo as BalanceInfo};
