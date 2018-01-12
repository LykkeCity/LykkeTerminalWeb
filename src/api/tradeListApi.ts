export interface TradeListApi {
  fetchAll: () => Promise<any[]>;
}

export class RestTradeListApi implements TradeListApi {
  fetchAll = () => Promise.resolve([]);
}

// tslint:disable-next-line:max-classes-per-file
export class MockTradeListApi implements TradeListApi {
  fetchAll = () =>
    Promise.resolve<any[]>([
      {
        Asset: 'BTC',
        DateTime: new Date(),
        Direction: 'Buy',
        OppositeAsset: 'USD',
        Price: 6500,
        Volume: 10
      },
      {
        Asset: 'BTC',
        DateTime: new Date(),
        Direction: 'Sell',
        OppositeAsset: 'EUR',
        Price: 6500,
        Volume: 10
      }
    ]);
}

export default TradeListApi;
