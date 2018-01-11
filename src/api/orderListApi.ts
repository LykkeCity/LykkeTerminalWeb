export interface OrderListApi {
  fetchAll: () => Promise<any[]>;
}

export class RestOrderListApi implements OrderListApi {
  fetchAll = () => Promise.resolve([]);
}

// tslint:disable-next-line:max-classes-per-file
export class MockOrderListApi implements OrderListApi {
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

export default OrderListApi;
