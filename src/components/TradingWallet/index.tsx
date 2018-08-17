import {withAuth} from '../Auth';
import {connect} from '../connect';
import Wallet from './Wallet';

const ConnectedWallet = connect(
  ({authStore: {isAuth}, uiStore: {readOnlyMode}}) => ({
    isAuth,
    readOnlyMode
  }),
  withAuth(Wallet)
);

export {ConnectedWallet as Wallet};
