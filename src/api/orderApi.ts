import RestApi from './restApi';

export interface OrderApi {
  orderByMarket: (body: any) => Promise<{[key: string]: any}>;
  orderByPending: (body: any) => Promise<{[key: string]: any}>;
}

export class RestOrderApi extends RestApi implements OrderApi {
  orderByMarket = (body: any) => this.postAndForget('/Orders/market', body);
  orderByPending = (body: any) =>
    this.postAndForget('/HotWallet/limitOrder', body);
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
}

export default OrderApi;
