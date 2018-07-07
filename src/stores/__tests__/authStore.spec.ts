import {AuthStore, RootStore} from '../index';

describe('auth store', () => {
  let authStore: AuthStore;
  let rootStore: RootStore;
  const api: any = {
    fetchBearerToken: jest.fn(),
    fetchUserInfo: jest.fn()
  };

  beforeEach(() => {
    rootStore = new RootStore(true);
    authStore = new AuthStore(rootStore, api);
  });

  describe('store', () => {
    it('should save a token', async () => {
      api.fetchBearerToken = jest.fn(() =>
        Promise.resolve({AccessToken: 'token'})
      );
      await authStore.fetchBearerToken('user', 'password');
      expect(authStore.isAuth).toBeTruthy();
    });

    it('should save positive KYC status and return truthy isKycPassed', async () => {
      api.fetchUserInfo = jest.fn(() => Promise.resolve({KycStatus: 'Ok'}));
      await authStore.fetchUserInfo();
      expect(authStore.isKycPassed).toBeTruthy();
    });

    it('should save negative KYC status and return falsy isKycPassed', async () => {
      api.fetchUserInfo = jest.fn(() => Promise.resolve({KycStatus: 'NoData'}));
      await authStore.fetchUserInfo();
      expect(authStore.isKycPassed).toBeFalsy();
    });

    it('should reset token and KYC status', async () => {
      api.fetchBearerToken = jest.fn(() =>
        Promise.resolve({AccessToken: 'token'})
      );
      api.fetchUserInfo = jest.fn(() => Promise.resolve({KycStatus: 'Ok'}));

      await authStore.fetchBearerToken('user', 'password');
      await authStore.fetchUserInfo();

      expect(authStore.isAuth).toBeTruthy();
      expect(authStore.isKycPassed).toBeTruthy();

      authStore.reset();

      expect(authStore.isAuth).toBeFalsy();
      expect(authStore.isKycPassed).toBeFalsy();
    });
  });

  describe('method fetchUserInfo', () => {
    let userInfo: object;
    beforeEach(() => {
      userInfo = {
        KycStatus: 'Ok',
        FirstName: 'First',
        LastName: 'Second'
      };
      api.fetchUserInfo = jest.fn(() => Promise.resolve(userInfo));
    });

    it('should set UserInfo in uiStore', async () => {
      rootStore.uiStore.setUserInfo = jest.fn();

      await authStore.fetchUserInfo();

      expect(rootStore.uiStore.setUserInfo).toHaveBeenCalled();
    });
  });
});
