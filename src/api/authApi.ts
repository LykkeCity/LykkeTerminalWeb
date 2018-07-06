import {keys} from '../models';
import {StorageUtils} from '../utils/index';
import {RestApi} from './index';
import {ApiResponse} from './types';

const refreshTokenStorage = StorageUtils(keys.refreshToken);

interface IUrlForAccessToken {
  grant_type: string;
  refresh_token?: string | null;
  code?: string | null;
  client_id: string | undefined;
  client_secret: string | undefined;
  redirect_uri: string | undefined;
}

const getUrlObjectForAccessToken = (
  grantType: string,
  code: string | null
): IUrlForAccessToken => {
  let urlObj: IUrlForAccessToken = {
    grant_type: grantType,
    client_id: process.env.REACT_APP_ID,
    client_secret: 'cebfeb21-e6c3-488c-873f-950c31f8386c',
    redirect_uri: process.env.REACT_APP_CALLBACK_URL
  };
  if (grantType === 'refresh_token') {
    urlObj = {
      ...urlObj,
      refresh_token: code
    };
  } else {
    urlObj = {
      ...urlObj,
      code
    };
  }
  return urlObj;
};

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

  fetchToken = async (
    code: string | null,
    accessToken: string,
    grantType: string
  ) => {
    let token: string;
    token = await this.fetchAccessToken(
      getUrlObjectForAccessToken(grantType, code)
    );
    return this.wretcher()
      .url(process.env.REACT_APP_AUTH_URL!, true)
      .headers({
        Authorization: `Bearer ${token}`,
        application_id: process.env.REACT_APP_ID
      })
      .url('/getlykkewallettoken')
      .get()
      .json();
  };

  fetchAccessToken = async (url: IUrlForAccessToken) => {
    const res = await this.wretcher()
      .url('https://auth-dev.lykkex.net/connect/token', true)
      .formUrl(url)
      .post()
      .json();

    if (!res) {
      await this.signout();
    }

    const token = res.access_token;
    const refreshToken = res.refresh_token;
    refreshTokenStorage.set(refreshToken);
    return token;
  };

  fetchUserInfo = () => this.get('/client/userinfo');

  signout = () =>
    this.wretcher()
      .url(process.env.REACT_APP_AUTH_URL!, true)
      .url('/signout')
      .post()
      .res();
}

export default RestAuthApi;
