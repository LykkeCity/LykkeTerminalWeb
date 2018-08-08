import {observer} from 'mobx-react';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar';
import WalletBalanceList, {WalletBalanceListProps} from './WalletBalanceList';

const ConnectedWalletBalanceList = connect<WalletBalanceListProps>(
  ({
    balanceListStore: {tradingWallet},
    uiStore: {selectedInstrument},
    uiOrderStore: {setSide, handlePercentageChange}
  }) => ({
    wallet: tradingWallet,
    assets: tradingWallet && tradingWallet.balances,
    selectedInstrument,
    setSide,
    handlePercentageChange
  }),
  withStyledScroll({height: 'calc(100% - 1.5rem)'})(observer(WalletBalanceList))
);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {
  default as WalletBalanceItem
} from './WalletBalanceItem/WalletBalanceItem';
