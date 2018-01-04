import AuthStore from '../../stores/authStore';
import {connect} from '../connect';
import SignInPage from './SignInPage';

export interface SignInPageState {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  commonError: string;
}

export interface SignInPageProps {
  authStore: AuthStore;
  history: any;
}

export interface InputFieldProps {
  id: string;
  inputValue: string;
  change: any;
  errorMessage: string;
}

export interface ErrorProps {
  errorMessage: string;
}

const connectedSignInPage = connect(
  ({authStore}) => ({
    authStore
  }),
  SignInPage
);

export {connectedSignInPage as SignInPage};
