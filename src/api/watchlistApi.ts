import {RestApi} from './restApi';

export interface WatchlistApi {
  fetchAll: () => Promise<{[key: string]: any}>;
}

export class RestWatchlistApi extends RestApi implements WatchlistApi {
  fetchAll = () => this.get('/WatchLists');
}

// tslint:disable-next-line:max-classes-per-file
export class MockWatchlistApi extends RestApi implements WatchlistApi {
  fetchAll = () =>
    Promise.resolve<any[]>([
      {
        AssetIds: [],
        Id: 1,
        Name: 'BTCUSD',
        ReadOnly: false
      }
    ]);
}

export default WatchlistApi;
