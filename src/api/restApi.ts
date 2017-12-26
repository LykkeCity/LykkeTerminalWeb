import wretch from 'wretch';

export class RestApi {
  protected readonly wretcher = wretch(process.env.REACT_APP_API_URL);

  get = (url: string) =>
    this.wretcher
      .url(url)
      .get()
      .json();

  post = (url: string, body: any) =>
    this.wretcher
      .url(url)
      .json(body)
      .post()
      .json();

  put = (url: string, body: any) =>
    this.wretcher
      .url(url)
      .json(body)
      .put()
      .json();

  delete = (url: string) =>
    this.wretcher
      .url(url)
      .delete()
      .res();
}

export default RestApi;
