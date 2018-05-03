import {observer} from 'mobx-react';
import {RootStore} from '../../stores';
import {withAuth} from '../Auth';
import {connect} from '../connect';
import Account from './Account';

const mapStoreToProps = ({authStore, uiStore}: RootStore) => ({
  isAuth: authStore.isAuth,
  readOnlyMode: uiStore.readOnlyMode
});

const ConnectedAccount = connect(mapStoreToProps, withAuth(observer(Account)));

export {ConnectedAccount as Account};
