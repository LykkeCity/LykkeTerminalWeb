import * as React from 'react';
import {Dir} from '../../models';
import {Table} from '../Table/index';
import {WatchlistProps} from './';
import {WatchlistItem} from './index';

const mapSideFromAsset = (asset: any) =>
  asset.id % 2 === 0 ? Dir.Up : Dir.Down;

const Watchlist: React.SFC<WatchlistProps> = ({assets = []}) => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Bid</th>
        <th>Ask</th>
      </tr>
    </thead>
    <tbody>
      {assets.map(asset => (
        <WatchlistItem
          key={asset.id}
          side={mapSideFromAsset(asset)}
          {...asset}
        />
      ))}
    </tbody>
  </Table>
);

export default Watchlist;
