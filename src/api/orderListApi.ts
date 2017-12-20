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
        createdDate: new Date(),
        currentPrice: 5900.65,
        currentPriceSide: 1,
        expiryDate: 'till end',
        id: 1,
        openPrice: 4850.0,
        orderID: 12389418351364984,
        side: 'Buy',
        symbol: 'BTCUSD',
        volume: 1
      },
      {
        createdDate: new Date(),
        currentPrice: 6580.0,
        currentPriceSide: 2,
        expiryDate: 'till end',
        id: 2,
        openPrice: 4850.0,
        orderID: 123894183511258965,
        side: 'Sell',
        symbol: 'EURUSD',
        volume: 1
      }
    ]);
}

export default OrderListApi;
