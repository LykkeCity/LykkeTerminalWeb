import Dir from '../../stores/dir';
import {connect} from '../connect';
import Watchlist from './Watchlist';

export interface WatchlistInterface {
  assets: any[];
}

export interface WatchlistItemInterface {
  id: string;
  name: string;
  bid: number;
  ask: number;
  side: Dir;
}

const ConnectedWatchlist = connect(
  ({watchlistStore: {activeWatchlists: {[0]: watchlist = {}}}}) => ({
    assets: watchlist.assets
  }),
  Watchlist
);

export {ConnectedWatchlist as Watchlist};
export {default as WatchlistItem} from './WatchlistItem/WatchlistItem';
