import wretch from 'wretch';
import {WretcherError} from 'wretch/dist/resolver';
import {keys} from '../models';
import RootStore from '../stores/rootStore';
import {StorageUtils} from '../utils/index';

// tslint:disable-next-line:no-var-requires
const URLSearchParams = require('url-search-params');

const tokenStorage = StorageUtils(keys.token);

export class RestApi {
  constructor(protected rootStore?: RootStore | any) {}

  protected readonly wretcher = () =>
    wretch(process.env.REACT_APP_API_URL)
      .polyfills({URLSearchParams})
      .auth(`Bearer ${tokenStorage.get()}`);

  protected readonly publicWretcher = () =>
    wretch(process.env.REACT_APP_PUBLIC_API_URL).polyfills({URLSearchParams});

  protected get = (url: string, headers: any = {}) =>
    this.wretcher()
      .headers(headers)
      .url(url)
      .get()
      .unauthorized((err: WretcherError) =>
        this.catchUnauthorized(err, () => this.get(url, headers))
      )
      .json();

  protected getWithQuery = <T = any>(
    url: string,
    query: {[key: string]: any}
  ) =>
    this.wretcher()
      .url(url)
      .query(query)
      .get()
      .unauthorized((err: WretcherError) =>
        this.catchUnauthorized(err, () => this.getWithQuery(url, query))
      )
      .json<T>();

  protected getPublic = (url: string) =>
    this.publicWretcher()
      .url(url)
      .get()
      .json();

  protected post = (url: string, body: any) => this._post(url, body).json();

  protected fireAndForget = (url: string, body: any, headers: any = {}) =>
    this._post(url, body, headers).res();

  protected fireAndForgetAndCatchUnauthErrorInSilence = (
    url: string,
    body: any,
    headers: any = {}
  ) => this._postInSilence(url, body, headers).res();

  protected fireAndCatchUnauthErrorInSilence = (url: string, body: any) =>
    this._postInSilence(url, body).json();

  protected patch = (url: string, body: any) =>
    this.wretcher()
      .url(url)
      .json(body)
      .patch()
      .unauthorized((err: WretcherError) =>
        this.catchUnauthorized(err, () => this.patch(url, body))
      )
      .res();

  protected put = (url: string, body: any) =>
    this.wretcher()
      .url(url)
      .json(body)
      .put()
      .unauthorized((err: WretcherError) =>
        this.catchUnauthorized(err, () => this.put(url, body))
      )
      .json();

  protected delete = (url: string) =>
    this.wretcher()
      .url(url)
      .delete()
      .unauthorized((err: WretcherError) =>
        this.catchUnauthorized(err, () => this.delete(url))
      )
      .res();

  private readonly catchUnauthorized = async (
    err: WretcherError,
    recallApi: any
  ) => {
    await this.rootStore!.authStore.catchUnauthorized();
    await this.rootStore!.reconnectToWs();
    return recallApi();
  };

  private readonly catchUnauthorizedInSilence = async (err: WretcherError) => {
    await this.rootStore!.authStore.catchUnauthorized();
    await this.rootStore!.reconnectToWs();
    throw err;
  };

  // tslint:disable-next-line:variable-name
  private readonly _post = (url: string, body: any, headers: any = {}) =>
    this.wretcher()
      .url(url)
      .headers(headers)
      .json(body)
      .post()
      .unauthorized((err: WretcherError) =>
        this.catchUnauthorized(err, () => this._post(url, body, headers))
      );

  // tslint:disable-next-line:variable-name
  private readonly _postInSilence = (
    url: string,
    body: any,
    headers: any = {}
  ) =>
    this.wretcher()
      .url(url)
      .headers(headers)
      .json(body)
      .post()
      .unauthorized(this.catchUnauthorizedInSilence);
}

export default RestApi;
