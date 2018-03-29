import {connect} from '../../connect';
import CurrentWallet from './CurrentWallet';

const connectedCurrentWallet = connect(
  ({balanceListStore: {getCurrentWallet: currentWallet}}) => ({
    currentWallet
  }),
  CurrentWallet
);

export {connectedCurrentWallet as CurrentWallet};
