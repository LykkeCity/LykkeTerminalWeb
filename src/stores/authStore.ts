import {computed, observable} from 'mobx';
import {AuthApi} from '../api/index';
import ModalMessages from '../constants/modalMessages';
import levels from '../constants/notificationLevels';
import messages from '../constants/notificationMessages';
import keys from '../constants/storageKeys';
import {KycStatuses} from '../models';
import Types from '../models/modals';
import {RandomString, StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const randomString = RandomString();
const tokenStorage = StorageUtils(keys.token);
const stateStorage = StorageUtils(keys.state);
const kycStatusStorage = StorageUtils(keys.kyc);

class AuthStore extends BaseStore {
  @computed
  get isAuth() {
    return !!this.token;
  }

  @computed
  get kyc() {
    return (
      this.kycStatus === KycStatuses.ReviewDone ||
      this.kycStatus === KycStatuses.Ok
    );
  }

  @computed
  get noKycAndFunds() {
    return (
      !this.kyc ||
      !this.rootStore.balanceListStore ||
      this.rootStore.balanceListStore.checkAnyFunds < 0
    );
  }

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
      const {token} = await this.api.fetchToken(accessToken);
      this.token = token;
      tokenStorage.set(token);
      stateStorage.clear();
      return Promise.resolve();
    } else {
      this.catchUnauthorized();
    }
  };

  fetchUserInfo = async (accessToken: string) => {
    let {KycStatus} = await this.api.fetchUserInfo(accessToken);
    KycStatus = KycStatus.toLowerCase();

    this.kycStatus = KycStatus;
    kycStatusStorage.set(KycStatus);
    return Promise.resolve();
  };

  catchUnauthorized = () => {
    this.rootStore.notificationStore.addNotification(
      levels.information,
      messages.expired
    );
    this.signOut();
  };

  showNoFundsAndKycModal = () => {
    this.rootStore.modalStore.addModal(
      ModalMessages.NoFundsAndKyc,
      null,
      null,
      Types.NoFundsAndKyc
    );
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

  reset = () => {
    this.kycStatus = '';
    this.token = '';
    kycStatusStorage.clear();
    tokenStorage.clear();
  };
}

export default AuthStore;
