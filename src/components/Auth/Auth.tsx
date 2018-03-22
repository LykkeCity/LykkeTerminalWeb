import {inject} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {AuthStore} from '../../stores/index';

interface AuthProps extends RouteComponentProps<any> {
  authStore: AuthStore;
}

@inject('authStore')
class Auth extends React.Component<AuthProps> {
  componentDidMount() {
    const accessToken = new URL(location.href).hash.split('&')[3].split('=')[1];
    const state = new URL(location.href).hash.split('&')[0].split('=')[1];
    const {authStore} = this.props;
    authStore
      .fetchToken(accessToken, state)
      .then(() => this.props.history.push('/'));
  }

  render() {
    return null;
  }
}

export default Auth;
