import {RestApi} from './index';
import {ApiResponse} from './types';

export interface AuthApi {
  fetchBearerToken: (app: any, code: string, path: string) => ApiResponse;
}

export class RestAuthApi extends RestApi implements AuthApi {
  fetchBearerToken = (path: string, email: string, password: string) =>
    this.post(path, {
      ClientInfo: '',
      Email: email, // bcc@t.com
      PartnerId: '',
      Password: password // 111111
    });
}

export default RestAuthApi;
