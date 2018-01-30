import {connect} from '../connect';
import BalanceList from './BalanceList';

export interface BalanceListProps {
  balances?: any[];
  total: number;
  accuracy: number;
}

export interface BalanceListItemProps {
  accuracy: number;
  balance: number;
  id: number;
  profitAndLoss: number;
  symbol: string;
}

const ConnectedBalanceList = connect(
  ({
    balanceListStore: {getBalances: balances, totalBalance: total},
    referenceStore
  }) => ({
    accuracy: (referenceStore.getAssetById(referenceStore.baseAssetId) || {
      accuracy: 2
    })!.accuracy,
    balances,
    total
  }),
  BalanceList
);

export {ConnectedBalanceList as BalanceList};
export {default as BalanceListItem} from './BalanceListItem/BalanceListItem';
