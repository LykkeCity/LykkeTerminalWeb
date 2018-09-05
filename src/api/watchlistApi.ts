import mockWatchlistApi from '../api/mocks/watchlistApi';
import {RestApi} from './restApi';

export interface WatchlistApi {
  fetchAll: () => Promise<{[key: string]: any}>;
}

export class RestWatchlistApi extends RestApi implements WatchlistApi {
  fetchAll = () =>
    this.extendWithMocks(
      () => this.get('/WatchLists'),
      () => mockWatchlistApi.fetchAll()
    );
}

export default WatchlistApi;
