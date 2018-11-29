import Side from '../models/side';
import RestApi from './restApi';
import {ApiResponse} from './types';

export interface PlaceOrder {
  AssetId: string;
  AssetPairId: string;
  OrderAction: Side;
  Price?: number;
  StopPrice?: number;
  Volume: number;
}

interface StopLimitBounds {
  LowerPrice: number | null;
  LowerLimitPrice: number | null;
  UpperPrice: number | null;
  UpperLimitPrice: number | null;
}

export interface CancelAllOrders {
  AssetPairId?: string;
}

export interface OrderApi {
  placeMarket: (body: PlaceOrder) => ApiResponse;
  placeLimit: (body: PlaceOrder) => ApiResponse;
  placeStopLimit: (body: PlaceOrder & StopLimitBounds) => ApiResponse;
  cancelOrder: (id: string) => ApiResponse;
  cancelAllOrders: (body: CancelAllOrders) => ApiResponse;
  fetchAll: () => ApiResponse;
}

export class RestOrderApi extends RestApi implements OrderApi {
  placeMarket = (body: any) => this.fireAndForget('/Orders/market', body);

  placeLimit = (body: any) => this.post('/Orders/limit', body);

  placeStopLimit = (body: any) => this.post('/Orders/stoplimit', body);

  cancelOrder = (id: string) =>
    this.fireAndForget(`/orders/limit/${id}/cancel`, {});

  cancelAllOrders = (body: any) => this.deleteWithParams(`/orders/limit`, body);

  fetchAll = () => this.get('/orders');
}

export default OrderApi;
