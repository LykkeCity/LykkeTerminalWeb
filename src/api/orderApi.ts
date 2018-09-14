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
    this.extendForOffline(
      () => this.fireAndForget('/Orders/market', body),
      () => mockOrderApi.placeMarket()
    );

  placeLimit = (body: any) =>
    this.extendForOffline(
      () => this.post('/Orders/limit', body),
      () => mockOrderApi.placeLimit()
    );

  cancelOrder = (id: string) =>
    this.extendForOffline(
      () => this.fireAndForget(`/orders/limit/${id}/cancel`, {}),
      () => mockOrderApi.cancelOrder()
    );

  cancelAllOrders = (body: any) =>
    this.extendForOffline(
      () => this.deleteWithParams(`/orders/limit`, body),
      () => mockOrderApi.cancelAllOrders()
    );

  fetchAll = (onRefetch?: any) =>
    this.extendForOffline(
      () => this.get('/orders'),
      () => mockOrderApi.fetchAll(),
      () => onRefetch()
    );
}

export default OrderApi;
