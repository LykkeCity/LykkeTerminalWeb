import {AuthApi} from '../api/index';
import {BaseStore, RootStore} from './index';

class AuthStore extends BaseStore {
  private token: string = '';

  constructor(store: RootStore, private readonly api: AuthApi) {
    super(store);
  }

  isAuth = () => {
    return localStorage.getItem('token');
  };

  fetchBearerToken = async (email: string, password: string) => {
    return this.api
      .fetchBearerToken('/client/auth', email, password)
      .then(res => {
        this.token = res.AccessToken;
        localStorage.setItem('token', this.token);
        return Promise.resolve();
      })
      .catch(err => Promise.reject(JSON.parse(err.message)));
  };

  signOut = () => {
    this.reset();
  };

  reset = () => {
    this.token = '';
    localStorage.removeItem('token');
  };
}

export default AuthStore;
