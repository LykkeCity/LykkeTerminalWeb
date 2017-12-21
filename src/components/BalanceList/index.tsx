import {connect} from '../connect';
import BalanceList from './BalanceList';

export interface BalanceListProps {
  balances?: any[];
}

export interface BalanceListItemProps {
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
