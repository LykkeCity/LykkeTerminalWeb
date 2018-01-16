import {RestApi} from './index';

const asDate = (d: any = Date.now()) => new Date(d).toISOString();

// tslint:disable:object-literal-sort-keys
class PriceApi extends RestApi {
  fetchHistory = (instrument: string, from: Date, to: Date, interval: string) =>
    this.get(
      `/candlesHistory/${instrument.toLowerCase()}/bid/${interval}/${asDate(
        from
      )}/${asDate(to)}`
    );
}

export default PriceApi;
