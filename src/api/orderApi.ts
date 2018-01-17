import RestApi from './restApi';
import {ApiResponse} from './types';

export interface OrderApi {
  placeMarket: (body: any) => ApiResponse;
  placePending: (body: any) => ApiResponse;
  fetchAll: () => Promise<any[]>;
}

export class RestOrderApi extends RestApi implements OrderApi {
  placeMarket = (body: any) =>
    this.fireAndForget('/Orders/market', body, {
      SignatureVerificationToken: 'asdasdasd'
    });
  placePending = (body: any) =>
    this.fireAndForget('/Orders/limit', body, {
      SignatureVerificationToken: 'asdasdasd'
    });
  fetchAll = () => Promise.resolve([]);
}

export default OrderApi;
