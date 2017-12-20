import * as React from 'react';
import Side from '../../stores/enums/side';
import {Table} from '../Table/index';
import {WatchlistItem} from './index';
import WatchlistInterface from './WathclistInterface';

const mapSideFromAsset = (asset: any) =>
  asset.id % 2 === 0 ? Side.Up : Side.Down;

const Watchlist: React.SFC<WatchlistInterface> = ({assets = []}) => (
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
