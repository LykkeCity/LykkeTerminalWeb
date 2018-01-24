import {RestApi} from './index';

const asDate = (d: any = Date.now()) => new Date(d).toISOString();

// tslint:disable:object-literal-sort-keys
class PriceApi extends RestApi {
  fetchCandles = (instrument: string, from: Date, to: Date, interval: string) =>
    this.get(
      `/candlesHistory/spot/${instrument.toLowerCase()}/bid/${interval}/${asDate(
        from
      )}/${asDate(to)}`
    );
}

export default PriceApi;
