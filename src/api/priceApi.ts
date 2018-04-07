import {RestApi} from './index';

class PriceApi extends RestApi {
  fetchCandles = (instrument: string, from: Date, to: Date, interval: string) =>
    this.get(
      `/candlesHistory/spot/${instrument}/trades/${interval}/${from.toISOString()}/${to.toISOString()}`
    );
}

export default PriceApi;
