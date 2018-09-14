import mockMarketApi from '../api/mocks/marketApi';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface MarketApi {
  convert: (body: any) => ApiResponse;
}

export class RestMarketApi extends RestApi implements MarketApi {
  convert = (body: any) =>
    this.extendForOffline(
      () => this.post('/market/converter', body),
      () => mockMarketApi.convert()
    );
}

export default new RestMarketApi();
