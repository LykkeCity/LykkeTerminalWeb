import {withAuth} from '../Auth';
import {connect} from '../connect';
import {withKyc} from '../Kyc';
import Wallet from './Wallet';

const ConnectedWallet = connect(
  ({authStore: {isAuth, isKycPassed}, uiStore: {readOnlyMode}}) => ({
    isAuth,
    isKycPassed,
    readOnlyMode
  }),
  withAuth(withKyc(Wallet, false))
);

export {ConnectedWallet as Wallet};
