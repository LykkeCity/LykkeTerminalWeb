import mockPriceApi from '../api/mocks/priceApi';
import {RestApi} from './index';

export interface PriceApi {
  fetchCandles: (
    instrument: string,
    from: Date,
    to: Date,
    interval: string
  ) => Promise<{[key: string]: any}>;
}

export class RestPriceApi extends RestApi implements PriceApi {
  fetchCandles = (
    instrument: string,
    from: Date,
    to: Date,
    interval: string,
    onRefetch?: any
  ) =>
    this.extendForOffline(
      () =>
        this.get(
          `/candlesHistory/spot/${instrument}/trades/${interval}/${from.toISOString()}/${to.toISOString()}`
        ),
      () => mockPriceApi.fetchCandles(instrument, from, to, interval),
      () => onRefetch()
    );
}

export default PriceApi;
