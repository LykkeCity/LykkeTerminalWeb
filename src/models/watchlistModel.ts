import {observable} from 'mobx';

class WatchlistModel {
  id: string;
  @observable name: string;
  @observable assetPairIds: string[];
  @observable readOnly: boolean;
  @observable order?: number;

  constructor(watchlist: Partial<WatchlistModel>) {
    Object.assign(this, watchlist);
  }
}

export default WatchlistModel;
