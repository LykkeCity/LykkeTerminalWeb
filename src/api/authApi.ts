import {RestApi} from './index';
import {ApiResponse} from './types';

export interface AuthApi {
  fetchBearerToken: (app: any, code: string, path: string) => ApiResponse;
}

export class RestAuthApi extends RestApi implements AuthApi {
  fetchBearerToken = (path: string) =>
    this.authWretch
      .url(path)
      .json({
        ClientInfo: '',
        Email: 'bcc@t.com',
        PartnerId: '',
        Password: '111111'
      })
      .post()
      .json();
}

export default RestAuthApi;
