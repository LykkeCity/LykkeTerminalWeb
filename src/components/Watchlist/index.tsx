import {connect} from '../connect';
import Watchlist from './Watchlist';

const ConnectedWatchlist = connect(
  ({watchlistStore: {activeWatchlists: {[0]: watchlist = {}}}}) => ({
    assets: watchlist.assets
  }),
  Watchlist
);

export {ConnectedWatchlist as Watchlist};
export {default as WatchlistItem} from './WatchlistItem';
