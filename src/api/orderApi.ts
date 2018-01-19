import RestApi from './restApi';
import {ApiResponse} from './types';

export interface OrderApi {
  placeMarket: (body: any) => ApiResponse;
  placeLimit: (body: any) => ApiResponse;
  fetchAll: () => ApiResponse;
}

// TODO: remove once backend implementation will be ready
const signature = {
  SignatureVerificationToken: 'asdasdasd'
};

export class RestOrderApi extends RestApi implements OrderApi {
  placeMarket = (body: any) =>
    this.fireAndForget('/Orders/market', body, signature);

  placeLimit = (body: any) =>
    this.fireAndForget('/Orders/limit', body, signature);

  // TODO: no need for verification token here
  fetchAll = () => this.get('/orders', signature);
}

export default OrderApi;
