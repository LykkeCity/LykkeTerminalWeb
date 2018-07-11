import {observer} from 'mobx-react';
import {connect} from '../../connect';
import CurrentWallet, {CurrentWalletProps} from './CurrentWallet';

const ConnectedCurrentWallet = connect<CurrentWalletProps>(
  ({balanceListStore: {tradingWallet}}) => ({
    wallet: tradingWallet
  }),
  observer(CurrentWallet)
);

export {ConnectedCurrentWallet as CurrentWallet};
