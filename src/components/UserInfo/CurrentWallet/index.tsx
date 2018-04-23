import {observer} from 'mobx-react';
import {connect} from '../../connect';
import CurrentWallet, {CurrentWalletProps} from './CurrentWallet';

const ConnectedCurrentWallet = connect<CurrentWalletProps>(
  ({balanceListStore: {currentWallet}}) => ({
    wallet: currentWallet
  }),
  observer(CurrentWallet)
);

export {ConnectedCurrentWallet as CurrentWallet};
