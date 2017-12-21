import wretch from 'wretch';
import {config} from '../config';

export class RestApi {
  protected readonly baseApiUrl = config.auth.apiUrls.app;

  protected readonly apiWretch = wretch()
    .url(this.baseApiUrl)
    .auth(`Bearer ${localStorage.getItem('token')}`);

  protected readonly authWretch = wretch()
    .url(this.baseApiUrl)
    .auth(`Bearer ${localStorage.getItem('token')}`);

  protected get = (url: string) =>
    this.apiWretch
      .url(url)
      .get()
      .json();
  protected post = (url: string, body: any) =>
    this.apiWretch
      .url(url)
      .json(body)
      .post()
      .json();
  protected put = (url: string, body: any) =>
    this.apiWretch
      .url(url)
      .json(body)
      .put()
      .json();
  protected delete = (url: string) =>
    this.apiWretch
      .url(url)
      .delete()
      .res();
}

export default RestApi;
