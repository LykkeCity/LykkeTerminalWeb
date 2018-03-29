import {observer} from 'mobx-react';
import {RootStore} from '../../../stores';
import {connect} from '../../connect';
import CurrentWallet, {CurrentWalletProps} from './CurrentWallet';

const mapStoreToProps = ({
  balanceListStore: {getCurrentWalletModel}
}: RootStore) => ({
  wallet: getCurrentWalletModel
});

const ConnectedCurrentWallet = connect<CurrentWalletProps>(
  mapStoreToProps,
  observer(CurrentWallet)
);

export {ConnectedCurrentWallet as CurrentWallet};
