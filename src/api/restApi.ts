import wretch from 'wretch';

export class RestApi {
  protected readonly wretcher = () => {
    return wretch(process.env.REACT_APP_API_URL).auth(
      `Bearer ${localStorage.getItem('token')}`
    );
  };

  protected get = (url: string) =>
    this.wretcher()
      .url(url)
      .get()
      .json();

  protected post = (url: string, body: any) =>
    this.wretcher()
      .url(url)
      .json(body)
      .post()
      .json();

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
}

export default RestApi;
