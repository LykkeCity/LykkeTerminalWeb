import * as React from 'react';
import Side from '../../stores/enums/side';
import {Table} from '../Table/index';
import {WatchlistItem} from './index';

const mapSideFromAsset = (asset: any) =>
  asset.id % 2 === 0 ? Side.Up : Side.Down;

interface WatchlistProps {
  assets: any[];
}

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
