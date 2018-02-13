import {inject} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {AuthStore} from '../../stores/index';

interface AuthProps extends RouteComponentProps<any> {
  authStore: AuthStore;
}

@inject('authStore')
export class Auth extends React.Component<AuthProps> {
  componentDidMount() {
    const accessToken = new URL(location.href).hash.split('&')[1].split('=')[1];
    const {authStore} = this.props;
    authStore.fetchToken(accessToken).then(() => this.props.history.push('/'));
  }

  render() {
    return null;
  }
}

export default Auth;
