import {computed, observable} from 'mobx';
import {AuthApi} from '../api/index';
import levels from '../constants/notificationLevels';
import messages from '../constants/notificationMessages';
import keys from '../constants/storageKeys';
import {RandomString, StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const randomString = RandomString();
const tokenStorage = StorageUtils(keys.token);
const stateStorage = StorageUtils(keys.state);

class AuthStore extends BaseStore {
  @computed
  get isAuth() {
    return !!this.token;
  }

  @observable private token: string = tokenStorage.get() || '';

  constructor(store: RootStore, private readonly api: AuthApi) {
    super(store);
  }

  fetchBearerToken = (email: string, password: string) =>
    this.api
      .fetchBearerToken('/client/auth', email, password)
      .then((resp: any) => {
        this.token = resp.AccessToken;
        tokenStorage.set(this.token);
        return Promise.resolve();
      })
      .catch((err: any) => Promise.reject(JSON.parse(err.message)));

  fetchToken = async (accessToken: string, state: string) => {
    if (state === stateStorage.get()) {
      const {token} = await this.api.fetchToken(accessToken);
      this.token = token;
      tokenStorage.set(token);
      stateStorage.clear();
      return Promise.resolve();
    } else {
      this.catchUnauthorized();
    }
  };

  catchUnauthorized = () => {
    this.rootStore.notificationStore.addNotification(
      levels.information,
      messages.expired
    );
    this.signOut();
  };

  signIn = () => {
    const {
      REACT_APP_AUTH_URL: url,
      REACT_APP_ID: clientId,
      REACT_APP_CALLBACK_URL: callbackUrl
    } = process.env;
    const nonce = randomString.mixed(20);
    const state = randomString.mixed(20);
    stateStorage.set(state);

    location.replace(
      `${url}/connect/authorize?client_id=${clientId}&scope=profile email address&response_type=token&redirect_uri=${encodeURIComponent(
        callbackUrl!
      )}&nonce=${nonce}&state=${state}`
    );
  };

  signOut = async () => {
    this.rootStore.reset();
    const {REACT_APP_AUTH_URL: url} = process.env;
    location.replace(
      `${url}/connect/logout?post_logout_redirect_uri=${encodeURIComponent(
        location.origin
      )}`
    );
  };

  reset = () => {
    this.token = '';
    tokenStorage.clear();
  };
}

export default AuthStore;
