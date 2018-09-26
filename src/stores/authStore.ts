import {computed, observable} from 'mobx';
import {AuthApi} from '../api/index';
import messages from '../constants/notificationMessages';
import {keys, KycStatuses, levels, UserInfoModel} from '../models';
import {RandomString, StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const randomString = RandomString();
const tokenStorage = StorageUtils(keys.token);
const stateStorage = StorageUtils(keys.state);
const sessionTokenStorage = StorageUtils(keys.sessionToken);
const kycStatusStorage = StorageUtils(keys.isKycPassed);

class AuthStore extends BaseStore {
  @computed
  get isAuth() {
    return !!this.token;
  }

  @computed
  get isKycPassed() {
    return (
      this.kycStatus === KycStatuses.ReviewDone ||
      this.kycStatus === KycStatuses.Ok
    );
  }

  @computed
  get noKycAndFunds() {
    return (
      !this.isKycPassed || !this.rootStore.balanceListStore.hasFundsOnBalance()
    );
  }

  @observable userInfo: UserInfoModel;

  @observable private token: string = tokenStorage.get() || '';
  @observable private kycStatus: string = kycStatusStorage.get() || '';

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
      const {token, authId} = await this.api.fetchToken(accessToken);
      sessionTokenStorage.set(authId);
      this.token = token;
      tokenStorage.set(token);
      stateStorage.clear();
      return Promise.resolve();
    } else {
      this.catchUnauthorized();
    }
  };

  fetchUserInfo = async () => {
    const userInfo = await this.api.fetchUserInfo();
    const {KycStatus} = userInfo;

    this.userInfo = new UserInfoModel(userInfo);
    this.kycStatus = KycStatus;
    kycStatusStorage.set(KycStatus);
    this.rootStore.uiStore.setUserInfo(userInfo);
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

  signOut = async (redirectUrl?: string) => {
    this.rootStore.reset();
    const {REACT_APP_AUTH_URL: url} = process.env;
    location.replace(
      `${url}/connect/logout?post_logout_redirect_uri=${encodeURIComponent(
        redirectUrl || location.origin
      )}`
    );
  };

  getSignInUrl = () => {
    const {
      REACT_APP_AUTH_URL: url,
      REACT_APP_ID: clientId,
      REACT_APP_CALLBACK_URL: callbackUrl
    } = process.env;
    const nonce = randomString.mixed(20);
    const state = randomString.mixed(20);
    stateStorage.set(state);

    return `${url}/connect/authorize?client_id=${clientId}&scope=profile email address&response_type=token&redirect_uri=${encodeURIComponent(
      callbackUrl!
    )}&nonce=${nonce}&state=${state}`;
  };

  reset = () => {
    this.kycStatus = '';
    this.token = '';
    kycStatusStorage.clear();
    tokenStorage.clear();
    sessionTokenStorage.clear();
  };
}

export default AuthStore;
