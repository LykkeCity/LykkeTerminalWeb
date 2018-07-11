import {pathOr} from 'rambda';
import {connect} from '../connect';
import {withScroll} from '../CustomScrollbar';
import BalanceList from './BalanceList';

export interface BalanceListProps {
  balances?: any[];
  baseAssetName: string;
  getTotalBalance: () => number;
  accuracy: number;
}

export interface BalanceListItemProps {
  accuracy: number;
  totalBalance: number;
  id: number;
  profitAndLoss: number;
  symbol: string;
  baseAssetName: string;
}

const ConnectedBalanceList = connect(
  ({
    balanceListStore: {
      tradingWallet: balances,
      getTotalBalance: getTotalBalance
    },
    referenceStore: {getAssetById, baseAssetId}
  }) => ({
    accuracy: pathOr(0, ['accuracy'], getAssetById(baseAssetId)),
    balances,
    baseAssetName: pathOr('', ['name'], getAssetById(baseAssetId)),
    getTotalBalance
  }),
  withScroll(BalanceList)
);

export {ConnectedBalanceList as BalanceList};
export {default as BalanceListItem} from './BalanceListItem';
