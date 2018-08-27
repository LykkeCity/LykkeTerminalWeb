import RestApi from './restApi';
import {ApiResponse} from './types';

export interface OrderApi {
  placeMarket: (body: any) => ApiResponse;
  placeLimit: (body: any) => ApiResponse;
  cancelOrder: (id: string) => ApiResponse;
  fetchAll: () => ApiResponse;
}

export class RestOrderApi extends RestApi implements OrderApi {
  placeMarket = (body: any) => this.fireAndForget('/Orders/market', body);

  placeLimit = (body: any) => this.post('/Orders/limit', body);

  cancelOrder = (id: string) =>
    this.fireAndForget(`/orders/limit/${id}/cancel`, {});

  fetchAll = () => this.get('/orders');
}

export default OrderApi;
