import RestApi from './restApi';
import {ApiResponse} from './types';

export interface OrderApi {
  placeMarket: (body: any) => ApiResponse;
  placeLimit: (body: any) => ApiResponse;
  cancelOrder: (id: string) => ApiResponse;
  fetchAll: () => ApiResponse;
}

export class RestOrderApi extends RestApi implements OrderApi {
  placeMarket = (body: any) =>
    this.fireAndForgetAndCatchUnauthErrorInSilence('/Orders/market', body);

  placeLimit = (body: any) =>
    this.fireAndCatchUnauthErrorInSilence('/Orders/limit', body);

  cancelOrder = (id: string) =>
    this.fireAndForgetAndCatchUnauthErrorInSilence(
      `/orders/limit/${id}/cancel`,
      {}
    );

  fetchAll = () => this.get('/orders');
}

export default OrderApi;
