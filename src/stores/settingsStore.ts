import {computed, observable} from 'mobx';
import keys from '../constants/storageKeys';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const confirmStorage = StorageUtils(keys.confirmReminder);
const layoutStorage = StorageUtils(keys.layout);
const themeStorage = StorageUtils(keys.themeDark);

class SettingsStore extends BaseStore {
  @observable layout: any;
  @observable settingsShown: boolean = false;
  @observable showConfirmations: boolean;
  @observable themeDark: boolean;

  @computed
  get settings() {
    return this.settingsShown;
  };

  @computed
  get confirmations() {
    return this.showConfirmations;
  };

  @computed
  get theme() {
    return this.themeDark;
  };

  constructor(store: RootStore) {
    super(store);
  }

  toggleSettings = () => {
    this.settingsShown = !this.settingsShown;
  };

  toggleConfirmations = () => {
    this.showConfirmations = !this.showConfirmations;
    confirmStorage.set(this.showConfirmations);
  };

  toggleTheme = () => {
    this.themeDark = !this.themeDark;
    themeStorage.set(this.themeDark);
  };

  init =() => {
    this.layout = JSON.parse(layoutStorage.get() as string);
    this.showConfirmations = JSON.parse(confirmStorage.get() as string) || true;
    this.themeDark = JSON.parse(themeStorage.get() as string) || true;
  };

  reset = () => {
    this.showConfirmations = true;
    this.themeDark = true;
  };
}

export default SettingsStore;
