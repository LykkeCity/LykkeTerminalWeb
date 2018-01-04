import AuthStore from '../../stores/authStore';
import {connect} from '../connect';
import Header from './Header';

export interface HeaderProps {
  authStore: AuthStore;
  history: any;
}

const connectedHeader = connect(
  ({authStore}) => ({
    authStore
  }),
  Header
);

export {connectedHeader as Header};
