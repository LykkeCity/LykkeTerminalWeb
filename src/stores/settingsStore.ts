import {computed, observable} from 'mobx';
import keys from '../constants/storageKeys';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const confirmStorage = StorageUtils(keys.confirmReminder);
const layoutStorage = StorageUtils(keys.layout);

class SettingsStore extends BaseStore {
  @observable settingsShown: boolean = false;

  @computed
  get settings() {
    return this.settingsShown;
  }

  get confirmations() {
    return JSON.parse(confirmStorage.get() as string);
  }

  get layout() {
    return JSON.parse(layoutStorage.get() as string);
  }

  constructor(store: RootStore) {
    super(store);
  }

  toggleSettings = () => {
    this.settingsShown = !this.settingsShown;
  };

  toggleConfirmations = () => {
    confirmStorage.set(!this.confirmations);
  };

  init = () => {
    if (this.confirmations === null) {
      confirmStorage.set(true);
    }
  };

  reset = () => {
    return null;
  };
}

export default SettingsStore;
