import mockOrderBookApi from '../api/mocks/orderBookApi';
import RestApi from './restApi';

export interface OrderBookApi {
  fetchAll: (id: string) => Promise<{[key: string]: any}>;
}

export class RestOrderBookApi extends RestApi implements OrderBookApi {
  fetchAll = (id: string) =>
    this.extendWithMocks(
      () => this.getWithQuery('/Orderbook', {assetPairId: id}),
      () => mockOrderBookApi.fetchAll()
    );
}

export default OrderBookApi;
