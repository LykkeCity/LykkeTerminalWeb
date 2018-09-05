import mockWatchlistApi from '../api/mocks/watchlistApi';
import {RestApi} from './restApi';

export interface WatchlistApi {
  fetchAll: () => Promise<{[key: string]: any}>;
}

export class RestWatchlistApi extends RestApi implements WatchlistApi {
  fetchAll = (onRefetch?: any) =>
    this.extendForOffline(
      () => this.get('/WatchLists'),
      () => mockWatchlistApi.fetchAll(),
      () => onRefetch()
    );
}

export default WatchlistApi;
