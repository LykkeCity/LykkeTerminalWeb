import {connect} from '../connect';
import Header from './Header';

const connectedHeader = connect(
  ({authStore}) => ({
    authStore
  }),
  Header
);

export {connectedHeader as Header};
