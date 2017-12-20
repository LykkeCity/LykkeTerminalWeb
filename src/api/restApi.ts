import wretch from 'wretch';

export class RestApi {
  protected readonly baseApiUrl = 'google.com';

  protected readonly apiWretch = wretch(this.baseApiUrl);

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
