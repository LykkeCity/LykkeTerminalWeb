import wretch from 'wretch';

export class RestApi {
  protected readonly baseApiUrl = 'google.com';

  protected readonly apiWretch = wretch(this.baseApiUrl);

  protected get = this._get();
  protected post = this._post();
  protected put = this._put();
  protected deleteRequest = this._delete();

  private _get() {
    return (url: string) =>
      this.apiWretch
        .url(url)
        .get()
        .text();
  }

  private _post() {
    return (url: string, body: any) =>
      this.apiWretch
        .url(url)
        .json(body)
        .post()
        .json();
  }

  private _put() {
    return (url: string, body: any) =>
      this.apiWretch
        .url(url)
        .json(body)
        .put()
        .json();
  }

  private _delete() {
    return (url: string) =>
      this.apiWretch
        .url(url)
        .delete()
        .res();
  }
}

export default RestApi;
