import {inject} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {AuthStore, BalanceListStore} from '../../stores/index';
import {AuthWrap} from './styles';

interface AuthProps extends RouteComponentProps<any> {
  authStore: AuthStore;
  balanceListStore: BalanceListStore;
}

@inject('authStore', 'balanceListStore')
class Auth extends React.Component<AuthProps> {
  componentDidMount() {
    const {authStore, balanceListStore} = this.props;
    authStore
      .fetchToken()
      .then(() =>
        authStore.fetchUserInfo().then(() => {
          balanceListStore.fetchAll().then(() => {
            this.props.history.push('/');
          });
        })
      )
      .catch(() => authStore.signIn());
  }

  render() {
    return (
      <AuthWrap>
        <div>You're logging in. Please wait...</div>
      </AuthWrap>
    );
  }
}

export default Auth;
