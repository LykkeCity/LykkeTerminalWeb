import mockOrderApi from '../api/mocks/orderApi';
import Side from '../models/side';
import RestApi from './restApi';
import {ApiResponse} from './types';

export interface PlaceOrder {
  AssetId: string;
  AssetPairId: string;
  OrderAction: Side;
  Price?: number;
  Volume: number;
}

export interface CancelAllOrders {
  AssetPairId?: string;
}

export interface OrderApi {
  placeMarket: (body: PlaceOrder) => ApiResponse;
  placeLimit: (body: PlaceOrder) => ApiResponse;
  cancelOrder: (id: string) => ApiResponse;
  cancelAllOrders: (body: CancelAllOrders) => ApiResponse;
  fetchAll: () => ApiResponse;
}

export class RestOrderApi extends RestApi implements OrderApi {
  placeMarket = (body: any) =>
    this.extendWithMocks(
      () => this.fireAndForget('/Orders/market', body),
      () => mockOrderApi.placeMarket()
    );

  placeLimit = (body: any) =>
    this.extendWithMocks(
      () => this.post('/Orders/limit', body),
      () => mockOrderApi.placeLimit()
    );

  cancelOrder = (id: string) =>
    this.extendWithMocks(
      () => this.fireAndForget(`/orders/limit/${id}/cancel`, {}),
      () => mockOrderApi.cancelOrder()
    );

  cancelAllOrders = (body: any) =>
    this.extendWithMocks(
      () => this.deleteWithParams(`/orders/limit`, body),
      () => mockOrderApi.cancelAllOrders()
    );

  fetchAll = () =>
    this.extendWithMocks(
      () => this.get('/orders'),
      () => mockOrderApi.fetchAll()
    );
}

export default OrderApi;
