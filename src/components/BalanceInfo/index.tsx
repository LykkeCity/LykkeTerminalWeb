import AssetStore from '../../stores/assetStore';
import UiStore from '../../stores/uiStore';
import {connect} from '../connect';
import BalanceInfo from './BalanceInfo';

export interface BalanceInfoProps {
  totalBalance?: number;
  assetStore: AssetStore;
  uiStore: UiStore;
}

const ConnectedBalanceInfo = connect(
  ({assetStore, balanceListStore: {totalBalance: totalBalance}, uiStore}) => ({
    assetStore,
    totalBalance,
    uiStore
  }),
  BalanceInfo
);

export {ConnectedBalanceInfo as BalanceInfo};
