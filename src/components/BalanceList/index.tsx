import {pathOr} from 'rambda';
import {connect} from '../connect';
import BalanceList from './BalanceList';

export interface BalanceListProps {
  balances?: any[];
  baseAssetName: string;
  total: number;
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
    balanceListStore: {getBalances: balances, totalBalance: total},
    referenceStore: {getAssetById, baseAssetId}
  }) => ({
    accuracy: pathOr(0, ['accuracy'], getAssetById(baseAssetId)),
    balances,
    baseAssetName: pathOr('', ['name'], getAssetById(baseAssetId)),
    total
  }),
  BalanceList
);

export {ConnectedBalanceList as BalanceList};
export {default as BalanceListItem} from './BalanceListItem';
