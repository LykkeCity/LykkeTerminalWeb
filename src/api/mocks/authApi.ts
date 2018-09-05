import {AuthApi} from '../authApi';

export class MockAuthApi implements AuthApi {
  fetchBearerToken = (app: any, code: string, path: string) =>
    Promise.resolve();

  fetchToken = () =>
    Promise.resolve<any>({
      authId: '00000000-0000-0000-0000-000000000000',
      token: '000000000000000000000000000000000000000000000000000000000000000'
    });

  fetchUserInfo = () =>
    Promise.resolve<any>({
      Email: 'mock@fixbackend.com',
      FirstName: 'First',
      KycStatus: 'Ok',
      LastName: 'Second'
    });

  signout = () => Promise.resolve();
}
export default new MockAuthApi();
