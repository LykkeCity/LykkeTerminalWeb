import wretch from 'wretch';
import keys from '../constants/storageKeys';
import {StorageUtils} from '../utils/index';

const tokenStorage = StorageUtils(keys.token);

export class RestApi {
  protected readonly wretcher = () =>
    wretch(process.env.REACT_APP_API_URL).auth(`Bearer ${tokenStorage.get()}`);

  protected get = (url: string) =>
    this.wretcher()
      .url(url)
      .get()
      .json();

  protected getWithQuery = (url: string, query: {[key: string]: any}) =>
    this.wretcher()
      .url(url)
      .query(query)
      .get()
      .json();

  protected post = (url: string, body: any) => this._post(url, body).json();

  protected fireAndForget = (url: string, body: any, headers: any = {}) =>
    this._post(url, body, headers).res();

  protected put = (url: string, body: any) =>
    this.wretcher()
      .url(url)
      .json(body)
      .put()
      .json();

  protected delete = (url: string) =>
    this.wretcher()
      .url(url)
      .delete()
      .res();

  // tslint:disable-next-line:variable-name
  private readonly _post = (url: string, body: any, headers: any = {}) =>
    this.wretcher()
      .url(url)
      .headers(headers)
      .json(body)
      .post();
}

export default RestApi;
