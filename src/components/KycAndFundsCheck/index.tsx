import {connect} from '../connect';
import KycAndFundsCheck from './KycAndFundsCheck';

const ConnectedKycAndFundsCheck = connect(
  ({reset}) => ({reset}),
  KycAndFundsCheck
);

export {ConnectedKycAndFundsCheck as KycAndFundsCheck};
