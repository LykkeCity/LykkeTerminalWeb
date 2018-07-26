import {withAuth} from '../Auth';
import {connect} from '../connect';
import {withKYC} from '../KYC';
import Wallet from './Wallet';

const ConnectedWallet = connect(
  ({authStore: {isAuth, isKycPassed}, uiStore: {readOnlyMode}}) => ({
    isAuth,
    isKycPassed,
    readOnlyMode
  }),
  withAuth(withKYC(Wallet, false))
);

export {ConnectedWallet as Wallet};
