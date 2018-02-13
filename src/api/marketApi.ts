import {RestApi} from './restApi';

export interface MarketApi {
  convert: (body: any) => Promise<any>;
}

export class RestMarketApi extends RestApi implements MarketApi {
  convert = (body: any) => this.post('/market/converter', body);
}

// tslint:disable-next-line:max-classes-per-file
export class MockMarketApi implements MarketApi {
  convert = () => Promise.resolve([]);
}

export default MarketApi;
