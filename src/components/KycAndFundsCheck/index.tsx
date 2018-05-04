import {connect} from '../connect';
import KycAndFundsCheck from './KycAndFundsCheck';

const ConnectedKycAndFundsCheck = connect(
  ({authStore: {signOut}}) => ({
    signOut
  }),
  KycAndFundsCheck
);

export {ConnectedKycAndFundsCheck as KycAndFundsCheck};
