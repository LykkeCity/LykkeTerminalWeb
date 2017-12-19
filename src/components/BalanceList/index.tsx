import {connect} from '../connect';
import BalanceList from './BalanceList';

const ConnectedBalanceList = connect(
  ({balanceListStore: {allBalanceLists: balances}}) => ({
    balances
  }),
  BalanceList
);

export {ConnectedBalanceList as BalanceList};
export {default as BalanceListItem} from './BalanceListItem/BalanceListItem';
