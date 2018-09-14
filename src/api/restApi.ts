import wretch from 'wretch';
import {ResponseChain, WretcherError} from 'wretch/dist/resolver';
import {keys} from '../models';
import RootStore from '../stores/rootStore';
import {StorageUtils} from '../utils/index';

// tslint:disable-next-line:no-var-requires
const URLSearchParams = require('url-search-params');

const tokenStorage = StorageUtils(keys.token);

const GATEWAY_TIMEOUT = 504;
const REFETCH_TIMEOUT = 60000;

export class RestApi {
  constructor(protected rootStore?: RootStore | any) {}

  protected readonly wretcher = () =>
    wretch(process.env.REACT_APP_API_URL)
      .polyfills({URLSearchParams})
      .auth(`Bearer ${tokenStorage.get()}`);

  protected readonly publicWretcher = () =>
    wretch(process.env.REACT_APP_PUBLIC_API_URL).polyfills({URLSearchParams});

  protected get = (url: string, headers: any = {}) =>
    this.extendByErrorHandlers(
      this.wretcher()
        .headers(headers)
        .url(url)
        .get()
        .unauthorized((error: WretcherError) => this.catchUnauthorized(error))
    ).json();

  protected getWithQuery = <T = any>(
    url: string,
    query: {[key: string]: any}
  ) =>
    this.extendByErrorHandlers(
      this.wretcher()
        .url(url)
        .query(query)
        .get()
    )
      .unauthorized((error: WretcherError) => this.catchUnauthorized(error))
      .json<T>();

  protected getPublic = (url: string) =>
    this.extendByErrorHandlers(
      this.publicWretcher()
        .url(url)
        .get()
    ).json();

  protected post = (url: string, body: any) => this._post(url, body).json();

  protected fireAndForget = (url: string, body: any, headers: any = {}) =>
    this._post(url, body, headers).res();

  protected patch = (url: string, body: any) =>
    this.extendByErrorHandlers(
      this.wretcher()
        .url(url)
        .json(body)
        .patch()
        .unauthorized((error: WretcherError) => this.catchUnauthorized(error))
    ).res();

  protected put = (url: string, body: any) =>
    this.extendByErrorHandlers(
      this.wretcher()
        .url(url)
        .json(body)
        .put()
        .unauthorized((error: WretcherError) => this.catchUnauthorized(error))
    ).json();

  protected delete = (url: string) =>
    this.extendByErrorHandlers(
      this.wretcher()
        .url(url)
        .delete()
        .unauthorized((error: WretcherError) => this.catchUnauthorized(error))
    ).res();

  protected deleteWithParams = (url: string, body: any) =>
    this.extendByErrorHandlers(
      this.wretcher()
        .url(url)
        .json(body)
        .delete()
        .unauthorized((error: WretcherError) => this.catchUnauthorized(error))
    ).res();

  protected extendForOffline = (
    callback: any,
    fallback: any,
    onRefetch?: any
  ) => {
    if (!this.rootStore) {
      return callback();
    }

    if (this.rootStore.apiStore.getUseMockData()) {
      return fallback();
    }

    if (this.rootStore.apiStore.getUseCacheData()) {
      return callback().catch(() => {
        setTimeout(() => onRefetch(), REFETCH_TIMEOUT);
      });
    }

    return callback();
  };

  private readonly catchUnauthorized = (error: WretcherError) => {
    this.rootStore!.authStore.catchUnauthorized();
    throw error;
  };

  private readonly catchError = (error: WretcherError) => {
    throw error;
  };

  // tslint:disable-next-line:variable-name
  private readonly _post = (url: string, body: any, headers: any = {}) =>
    this.extendByErrorHandlers(
      this.wretcher()
        .url(url)
        .headers(headers)
        .json(body)
        .post()
        .unauthorized((error: WretcherError) => this.catchUnauthorized(error))
    );

  private extendByErrorHandlers = (chain: ResponseChain) => {
    return chain
      .badRequest(this.catchError)
      .timeout(this.catchError)
      .internalError(this.catchError)
      .error(GATEWAY_TIMEOUT, this.catchError);
  };
}

export default RestApi;
