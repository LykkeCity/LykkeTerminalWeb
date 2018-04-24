import {RestApi} from './index';
import {ApiResponse} from './types';

export interface AuthApi {
  fetchBearerToken: (app: any, code: string, path: string) => ApiResponse;
}

export class RestAuthApi extends RestApi implements AuthApi {
  fetchBearerToken = (path: string, email: string, password: string) =>
    this.post(path, {
      ClientInfo: '',
      Email: email,
      PartnerId: '',
      Password: password
    });

  fetchToken = (accessToken: string) =>
    this.wretcher()
      .url(process.env.REACT_APP_AUTH_URL!, true)
      .headers({
        Authorization: `Bearer ${accessToken}`,
        application_id: process.env.REACT_APP_ID
      })
      .url('/getlykkewallettoken')
      .get()
      .json();

  fetchUserInfo = (accessToken: string) => this.get('/client/userinfo');

  signout = () =>
    this.wretcher()
      .url(process.env.REACT_APP_AUTH_URL!, true)
      .url('/signout')
      .post()
      .res();
}

export default RestAuthApi;
