import RestApi from './restApi';

export interface OrderBookApi {
  fetchAll: (id: string) => Promise<{[key: string]: any}>;
}

export class RestOrderBookApi extends RestApi implements OrderBookApi {
  fetchAll = (id: string) => this.getWithQuery('/Orderbook', {assetPairId: id});
}

// tslint:disable-next-line:max-classes-per-file
export class MockOrderBookApi implements OrderBookApi {
  fetchAll = () => Promise.resolve<any[]>(generateOrders());
}

export default OrderBookApi;

const generateOrders = (): any[] => {
  let quotes: any[] = [];

  for (let i = 0; i < 10; i++) {
    quotes = [
      ...quotes,
      {
        ask: i > 5 ? 0 : (Math.random() * 100).toFixed(),
        bid: i < 6 ? 0 : (Math.random() * 100).toFixed(),
        id: i,
        price: (Math.random() * 1000).toFixed(3),
        timestamp: new Date()
      }
    ];
  }

  return quotes;
};
