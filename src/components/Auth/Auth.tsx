import {inject} from 'mobx-react';
import {compose, curry} from 'rambda';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import paths from '../../constants/paths';
import {AuthStore, BalanceListStore} from '../../stores/index';
import Backdrop from '../Backdrop/Backdrop';
import CommonLoader from '../Loader/commonLoader';

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
          if (authStore.noKycAndFunds) {
            return this.props.history.push(paths.kycAndFundsCheck);
          } else {
            this.props.history.push('/');
          }
        });
      })
    );
  }

  render() {
    return (
      <div>
        <Backdrop />
        <CommonLoader loadingDescription={'Authorization...'} />
      </div>
    );
  }
}

export default Auth;
