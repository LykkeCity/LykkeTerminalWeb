import {inject, observer} from 'mobx-react';
import {RootStore} from '../../stores/index';
import Watchlist from './Watchlist';

const mapStoreToProps = ({watchlistStore: {activeWatchlists}}: RootStore) => ({
  instruments: activeWatchlists[0] && activeWatchlists[0].instruments
});

const ConnectedWatchlist = inject(mapStoreToProps)(observer(Watchlist));

export {ConnectedWatchlist as Watchlist};
