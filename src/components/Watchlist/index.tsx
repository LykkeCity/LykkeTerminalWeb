import Dir from '../../stores/dir';
import {connect} from '../connect';
import Watchlist from './Watchlist';

export interface WatchlistProps {
  assets: any[];
}

export interface WatchlistItemProps {
  id: string;
  name: string;
  bid: number;
  ask: number;
  side: Dir;
}

const connectedWatchlist = connect(
  ({watchlistStore: {activeWatchlists: {[0]: watchlist = {}}}}) => ({
    assets: watchlist.assets
  }),
  Watchlist
);

export {connectedWatchlist as Watchlist};
export {default as WatchlistItem} from './WatchlistItem/WatchlistItem';
