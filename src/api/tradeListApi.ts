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
        id: 1,
        price: 5000,
        quantity: 10,
        side: 'Buy',
        symbol: 'BTCUSD',
        timestamp: new Date()
      },
      {
        id: 2,
        price: 6500,
        quantity: 10,
        side: 'Sell',
        symbol: 'EURUSD',
        timestamp: new Date()
      }
    ]);
}

export default TradeListApi;
