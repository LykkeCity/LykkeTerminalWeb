import {inject} from 'mobx-react';
import {compose, curry} from 'rambda';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import paths from '../../constants/paths';
import {AuthStore} from '../../stores/index';

interface AuthProps extends RouteComponentProps<any> {
  authStore: AuthStore;
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

@inject('authStore')
class Auth extends React.Component<AuthProps> {
  componentDidMount() {
    const {authStore} = this.props;
    if (authStore.isAuth) {
      this.props.history.push(paths.main);
      return;
    }

    const accessToken = getCurrentUrlFragmentValue('access_token');
    const state = getCurrentUrlFragmentValue('state');

    authStore
      .fetchToken(accessToken, state)
      .then(() => this.props.history.push('/'));
  }

  render() {
    return null;
  }
}

export default Auth;
