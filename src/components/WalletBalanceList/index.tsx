import {observer} from 'mobx-react';
import {Side} from 'src/models';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar';
import WalletBalanceItem from './WalletBalanceItem/WalletBalanceItem';
import WalletBalanceList, {WalletBalanceListProps} from './WalletBalanceList';

const ConnectedWalletBalanceList = connect<WalletBalanceListProps>(
  ({
    balanceListStore: {tradingWallet},
    uiStore: {selectedInstrument},
    uiStore
  }) => ({
    wallet: tradingWallet,
    assets: tradingWallet && tradingWallet.balances,
    selectedInstrument,
    setSide: (side: Side) => {
      uiStore.selectedSide = side;
    },
    setAmount: (amount: number) => {
      uiStore.selectedAmount = amount;
    }
  }),
  withStyledScroll({height: 'calc(100% - 1.5rem)'})(observer(WalletBalanceList))
);

const ObservedWalletBalanceItem = observer(WalletBalanceItem);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {ObservedWalletBalanceItem as WalletBalanceItem};
