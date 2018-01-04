import {computed, observable} from 'mobx';
import {AuthApi} from '../api/index';
import keys from '../constants/storageKeys';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const tokenStorage = StorageUtils(keys.token);

class AuthStore extends BaseStore {
  @computed
  get isAuth() {
    return !!this.token;
  }

  @observable private token: any = null;

  constructor(store: RootStore, private readonly api: AuthApi) {
    super(store);
    this.token = tokenStorage.get();
  }

  fetchBearerToken = async (email: string, password: string) => {
    return this.api
      .fetchBearerToken('/client/auth', email, password)
      .then(res => {
        this.token = res.AccessToken;
        tokenStorage.set(this.token);
        return Promise.resolve();
      })
      .catch(err => Promise.reject(JSON.parse(err.message)));
  };

  signOut = () => {
    this.reset();
  };

  reset = () => {
    this.token = null;
    tokenStorage.clear();
  };
}

export default AuthStore;
