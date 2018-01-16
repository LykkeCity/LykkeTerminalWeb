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

// tslint:disable-next-line:max-classes-per-file
export class MockOrderApi extends RestApi implements OrderApi {
  orderByPending = (body: any) => {
    const order = {
      Asset: body.AssetId,
      AssetPair: body.AssetPair,
      DateTime: new Date(),
      Id: 1549153684,
      OrderType: body.Volume > 0 ? 'Buy' : 'Sell',
      Price: body.Price || 1246498,
      TotalCost: 0,
      Volume: body.Volume
    };
    return Promise.resolve<any[]>([order]);
  };
  orderByMarket = (body: any) => {
    const order = {
      Asset: body.AssetId,
      AssetPair: body.AssetPair,
      DateTime: new Date(),
      Id: 1549153684,
      OrderType: body.Volume > 0 ? 'Buy' : 'Sell',
      Price: body.Price || 1246498,
      TotalCost: 0,
      Volume: body.Volume
    };
    return Promise.resolve<any[]>([order]);
  };
  fetchAll = () =>
    Promise.resolve<any[]>([
      {
        AssetPair: 'BTCUSD',
        DateTime: new Date(),
        Id: 12389418351364984,
        OrderType: 'Buy',
        Price: 5900.65,
        Volume: 1
      },
      {
        AssetPair: 'EURUSD',
        DateTime: new Date(),
        Id: 123894183511258965,
        OrderType: 'Sell',
        Price: 6580.0,
        Volume: 1
      }
    ]);
}

export default OrderApi;
