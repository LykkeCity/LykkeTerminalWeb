import {RestApi} from './restApi';

export interface MarketsApi {
  convert: (body: any) => Promise<any>;
}

export class RestMarketsApi extends RestApi implements MarketsApi {
  convert = (body: any) => this.post('/market/converter', body);
}

// tslint:disable-next-line:max-classes-per-file
export class MockMarketsApi implements MarketsApi {
  convert = () => Promise.resolve<any[]>([]);
}

export default MarketsApi;
