import {MarketApi} from '../marketApi';

export class MockMarketApi implements MarketApi {
  convert = () => Promise.resolve();
}

export default new MockMarketApi();
