import wretch from 'wretch';
import {WretcherError} from 'wretch/dist/resolver';
import keys from '../constants/storageKeys';
import RootStore from '../stores/rootStore';
import {StorageUtils} from '../utils/index';

const tokenStorage = StorageUtils(keys.token);

export class RestApi {
  constructor(protected rootStore?: RootStore | any) {}

  protected readonly wretcher = () =>
    wretch(process.env.REACT_APP_API_URL).auth(`Bearer ${tokenStorage.get()}`);

  protected readonly publicWretcher = () =>
    wretch(process.env.REACT_APP_PUBLIC_API_URL);

  protected get = (url: string, headers: any = {}) =>
    this.wretcher()
      .headers(headers)
      .url(url)
      .get()
      .unauthorized((err: WretcherError) => this.catchUnauthorized(err))
      .json();

  protected getWithQuery = <T = any>(
    url: string,
    query: {[key: string]: any}
  ) =>
    this.wretcher()
      .url(url)
      .query(query)
      .get()
      .unauthorized((err: WretcherError) => this.catchUnauthorized(err))
      .json<T>();

  protected post = (url: string, body: any) => this._post(url, body).json();

  protected fireAndForget = (url: string, body: any, headers: any = {}) =>
    this._post(url, body, headers).res();

  protected put = (url: string, body: any) =>
    this.wretcher()
      .url(url)
      .json(body)
      .put()
      .unauthorized((err: WretcherError) => this.catchUnauthorized(err))
      .json();

  protected delete = (url: string) =>
    this.wretcher()
      .url(url)
      .delete()
      .unauthorized((err: WretcherError) => this.catchUnauthorized(err))
      .res();

  private readonly catchUnauthorized = (err: WretcherError) => {
    this.rootStore!.authStore.catchUnauthorized();
    throw err;
  };

  // tslint:disable-next-line:variable-name
  private readonly _post = (url: string, body: any, headers: any = {}) =>
    this.wretcher()
      .url(url)
      .headers(headers)
      .json(body)
      .post()
      .unauthorized((err: WretcherError) => this.catchUnauthorized(err));
}

export default RestApi;
