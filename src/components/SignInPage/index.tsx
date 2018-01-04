import {connect} from '../connect';
import SignInPage from './SignInPage';

const connectedSignInPage = connect(
  ({authStore}) => ({
    authStore
  }),
  SignInPage
);

export {connectedSignInPage as SignInPage};
