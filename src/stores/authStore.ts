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
      redirect_uri: `${location.origin}/assets/signin-callback.html`,
      silent_redirect_uri: `${location.origin}/assets/silent-callback.html`,
      post_logout_redirect_uri: location.origin,
      response_type: openIdConstants.responseType,
      filterProtocolClaims: true,
      loadUserInfo: false,
      automaticSilentRenew: true
    };

    this.userManager = new UserManager(settings);
    this.userManager.events.addSilentRenewError(() => {
      this.signOut();
    });
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

  fetchToken = async () => {
    const user = await this.userManager.getUser();
    if (!user) {
      return Promise.reject();
    }
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
    this.userManager.signinRedirect();
  };

  signOut = async () => {
    this.rootStore.reset();
    this.userManager.signoutRedirect();
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
