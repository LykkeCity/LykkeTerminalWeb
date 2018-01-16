import RestApi from './restApi';
import {ApiResponse} from './types';

export interface OrderApi {
  orderByMarket: (body: any) => ApiResponse;
  orderByPending: (body: any) => ApiResponse;
  fetchAll: () => Promise<any[]>;
}

export class RestOrderApi extends RestApi implements OrderApi {
  orderByMarket = (body: any) =>
    this.fireAndForget('/Orders/market', body, {
      SignatureVerificationToken: 'asdasdasd'
    });
  orderByPending = (body: any) =>
    this.fireAndForget('/Orders/limit', body, {
      SignatureVerificationToken: 'asdasdasd'
    });
  fetchAll = () => Promise.resolve([]);
}

export default OrderApi;
