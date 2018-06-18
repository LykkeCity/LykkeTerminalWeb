import {RestApi} from './restApi';

export interface WatchlistApi {
  fetchAll: () => Promise<{[key: string]: any}>;
}

export class RestWatchlistApi extends RestApi implements WatchlistApi {
  fetchAll = () => this.get('/WatchLists');
}

export default WatchlistApi;
