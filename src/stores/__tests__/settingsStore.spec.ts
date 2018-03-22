import {RootStore, SettingsStore} from '../index';

describe('settings store', () => {
  let settingsStoreStore: SettingsStore;

  beforeEach(() => {
    settingsStoreStore = new SettingsStore(new RootStore(false));
  });

  it('settings should be hidden by default', () => {
    expect(settingsStoreStore.showSettings).toBeDefined();
    expect(settingsStoreStore.showSettings).toBe(false);
  });

  it('should show settings modal', () => {
    settingsStoreStore.toggleSettings();

    expect(settingsStoreStore.showSettings).toBe(true);
  });
});
