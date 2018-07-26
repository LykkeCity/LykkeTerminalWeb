import {inject} from 'mobx-react';
import {compose, curry} from 'rambda';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {AuthStore, BalanceListStore} from '../../stores/index';

interface AuthProps extends RouteComponentProps<any> {
  authStore: AuthStore;
  balanceListStore: BalanceListStore;
}
const getUrlFragmentByKey = (fragments: string[], key: string) =>
  fragments.find(f => f.toLowerCase().startsWith(key.toLowerCase()));

const getUrlFragmentValue = (fragment: string) => fragment.split('=')[1];

const currentUrl = new URL(location.href).hash.substring(1).split('&');
const getCurrentUrlFragmentByKey = curry(getUrlFragmentByKey)(currentUrl);
const getCurrentUrlFragmentValue = compose(
  getUrlFragmentValue,
  getCurrentUrlFragmentByKey
);

@inject('authStore', 'balanceListStore')
class Auth extends React.Component<AuthProps> {
  componentDidMount() {
    const accessToken = getCurrentUrlFragmentValue('access_token');
    const state = getCurrentUrlFragmentValue('state');
    const {authStore, balanceListStore} = this.props;
    authStore.fetchToken(accessToken, state).then(() =>
      authStore.fetchUserInfo().then(() => {
        balanceListStore.fetchAll().then(() => {
          this.props.history.push('/');
        });
      })
    );
  }

  render() {
    return null;
  }
}

export default Auth;
