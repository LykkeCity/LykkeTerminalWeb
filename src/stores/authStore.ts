import {computed, observable} from 'mobx';
import {AuthApi} from '../api/index';
import levels from '../constants/notificationLevels';
import messages from '../constants/notificationMessages';
import keys from '../constants/storageKeys';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const tokenStorage = StorageUtils(keys.token);
const notificationStorage = StorageUtils(keys.notificationId);

class AuthStore extends BaseStore {
  @computed
  get isAuth() {
    return !!this.token;
  }

  @observable private token: string = tokenStorage.get() || '';
  @observable private notificationId: string = notificationStorage.get() || '';

  constructor(store: RootStore, private readonly api: AuthApi) {
    super(store);
  }

  fetchBearerToken = (email: string, password: string) =>
    this.api
      .fetchBearerToken('/client/auth', email, password)
      .then((resp: any) => {
        this.token = resp.AccessToken;
        this.notificationId = resp.NotificationsId;
        tokenStorage.set(this.token);
        notificationStorage.set(this.notificationId);
        return Promise.resolve();
      })
      .catch((err: any) => Promise.reject(JSON.parse(err.message)));

  catchUnauthorized = () => {
    this.rootStore.notificationStore.addNotification(
      levels.information,
      messages.expired
    );
    this.signOut();
  };

  signOut = () => {
    this.rootStore.reset();
    this.rootStore.start();
  };

  reset = () => {
    this.token = '';
    this.notificationId = '';
    tokenStorage.clear();
  };
}

export default AuthStore;
