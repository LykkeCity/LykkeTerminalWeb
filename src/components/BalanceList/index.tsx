import {connect} from '../connect';
import BalanceList from './BalanceList';

export interface BalanceListInterface {
  balances?: any[];
}

export interface BalanceListItemInterface {
  balance: number;
  id: number;
  profitAndLoss: number;
  symbol: string;
}

const ConnectedBalanceList = connect(
  ({balanceListStore: {allBalanceLists: balances}}) => ({
    balances
  }),
  BalanceList
);

export {ConnectedBalanceList as BalanceList};
export {default as BalanceListItem} from './BalanceListItem/BalanceListItem';
