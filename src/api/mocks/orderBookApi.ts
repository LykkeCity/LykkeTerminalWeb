import randomNumber from '../../utils/randomNumber';
import OrderBookApi from '../orderBookApi';

const generateOrders = (): any[] => {
  let quotes: any[] = [];

  for (let i = 0; i < 10; i++) {
    quotes = [
      ...quotes,
      {
        ask: i > 5 ? 0 : randomNumber(1000, 2000).toFixed(),
        bid: i < 6 ? 0 : randomNumber(1000, 2000).toFixed(),
        id: i,
        price: randomNumber(1000, 2000).toFixed(3),
        timestamp: new Date()
      }
    ];
  }

  return quotes;
};

export class MockOrderBookApi implements OrderBookApi {
  fetchAll = () => Promise.resolve<any[]>(generateOrders());
}

export default new MockOrderBookApi();
