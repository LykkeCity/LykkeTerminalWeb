import {AuthApi} from '../api/index';
import {BaseStore, RootStore} from './index';

class AuthenticationStore extends BaseStore {
  private token: string = '';

  constructor(store: RootStore, private readonly api: AuthApi) {
    super(store);
  }

  fetchBearerToken = async () => {
    const res = await this.api.fetchBearerToken('/client/auth');
    this.token = res.AccessToken;
    localStorage.setItem('token', this.token);
  };

  reset = () => {
    this.token = '';
    localStorage.removeItem('token');
  };
}

export default AuthenticationStore;
