import wretch from 'wretch';
import keys from '../constants/storageKeys';
import {StorageUtils} from '../utils/index';

const tokenStorage = StorageUtils(keys.token);

export class RestApi {
  protected readonly wretcher = () => {
    return wretch(process.env.REACT_APP_API_URL).auth(
      `Bearer ${tokenStorage.get()}`
    );
  };

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

  protected post = (url: string, body: any) =>
    this.postWrapper(url, body).json();

  protected postAndForget = (url: string, body: any) =>
    this.postWrapper(url, body).res();

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

  private readonly postWrapper = (url: string, body: any) => {
    return this.wretcher()
      .url(url)
      .json(body)
      .post();
  };
}

export default RestApi;
