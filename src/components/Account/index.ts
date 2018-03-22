import {observer} from 'mobx-react';
import {RootStore} from '../../stores';
import {withAuth} from '../Auth';
import {connect} from '../connect';
import Account from './Account';

const mapStoreToProps = ({authStore}: RootStore) => ({
  isAuth: authStore.isAuth
});

const ConnectedAccount = connect(mapStoreToProps, withAuth(observer(Account)));

export {ConnectedAccount as Account};
