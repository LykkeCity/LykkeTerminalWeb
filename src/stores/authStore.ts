import {computed, observable} from 'mobx';
import {UserManager} from 'oidc-client';
import {AuthApi} from '../api/index';
import messages from '../constants/notificationMessages';
import {openIdConstants} from '../constants/openId';
import {keys, KycStatuses, levels, UserInfoModel} from '../models';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const tokenStorage = StorageUtils(keys.token);
const sessionTokenStorage = StorageUtils(keys.sessionToken);
const kycStatusStorage = StorageUtils(keys.isKycPassed);

// tslint:disable:no-console
class AuthStore extends BaseStore {
  @computed
  get isAuth() {
    return !!this.token;
  }

  @computed
  get isKycPassed() {
    return this.kycStatus === KycStatuses.Ok;
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
  private userManager: UserManager;

  constructor(store: RootStore, private readonly api: AuthApi) {
    super(store);

    const settings = {
      authority: process.env.REACT_APP_AUTH_URL!,
      client_id: process.env.REACT_APP_ID!,
      redirect_uri:
        process.env.REACT_APP_CALLBACK_URL &&
        process.env.REACT_APP_CALLBACK_URL.toString(),
      post_logout_redirect_uri: location.origin,
      silent_redirect_uri:
        process.env.REACT_APP_CALLBACK_URL &&
        process.env.REACT_APP_CALLBACK_URL.toString(),
      response_type: openIdConstants.responseType,
      scope: openIdConstants.scope,
      filterProtocolClaims: true,
      loadUserInfo: false,
      automaticSilentRenew: true
    };

    this.userManager = new UserManager(settings);
    this.userManager.events.addSilentRenewError(() => {
      this.userManager.signoutRedirect();
    });
    this.userManager.events.addUserLoaded(() => {
      console.log('reload');
    });
  }

  renew = () => {
    this.userManager.signinSilent().then(user => console.log(user));
  };

  fetchBearerToken = (email: string, password: string) =>
    this.api
      .fetchBearerToken('/client/auth', email, password)
      .then((resp: any) => {
        this.token = resp.AccessToken;
        tokenStorage.set(this.token);
        return Promise.resolve();
      })
      .catch((err: any) => Promise.reject(JSON.parse(err.message)));

  fetchToken = async () => {
    const check = await this.userManager.getUser();
    const user = await this.userManager.signinRedirectCallback();
    console.log(check);
    const {access_token} = user;
    const {token, authId} = await this.api.fetchToken(access_token);
    sessionTokenStorage.set(authId);
    this.token = token;
    tokenStorage.set(token);
    return Promise.resolve();
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
    return this.userManager.signinRedirect();
  };

  signOut = async () => {
    this.rootStore.reset();
    await this.userManager.signoutRedirect();
  };

  getSignInUrl = () => {
    const {REACT_APP_AUTH_URL: url, REACT_APP_ID: clientId} = process.env;
    const nonce = randomString.mixed(20);
    const state = randomString.mixed(20);
    stateStorage.set(state);

    const callbackUrl = window.location.origin + '/auth';

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
