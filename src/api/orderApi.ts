import RestApi from './restApi';
import {ApiResponse} from './types';

export interface CancelAllOrdersProps {
  AssetPairId?: string;
}

export interface OrderApi {
  placeMarket: (body: any) => ApiResponse;
  placeLimit: (body: any) => ApiResponse;
  cancelOrder: (id: string) => ApiResponse;
  cancelAllOrders: (body: CancelAllOrdersProps) => ApiResponse;
  fetchAll: () => ApiResponse;
}

export class RestOrderApi extends RestApi implements OrderApi {
  placeMarket = (body: any) => this.fireAndForget('/Orders/market', body);

  placeLimit = (body: any) => this.post('/Orders/limit', body);

  cancelOrder = (id: string) =>
    this.fireAndForget(`/orders/limit/${id}/cancel`, {});

  cancelAllOrders = (body: any) => this.deleteWithParams(`/orders/limit`, body);

  fetchAll = () => this.get('/orders');
}

export default OrderApi;
