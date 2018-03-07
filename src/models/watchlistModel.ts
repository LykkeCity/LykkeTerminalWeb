import {extendObservable} from 'mobx';

class WatchlistModel {
  id: number;
  name: string;
  assetIds: string[];
  readOnly: boolean;
  order?: number;

  constructor(watchlist: Partial<WatchlistModel>) {
    extendObservable(this, watchlist);
  }
}

export default WatchlistModel;
