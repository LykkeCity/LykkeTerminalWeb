import * as React from 'react';
import {Icon} from '../Icon/index';
import {Table} from '../Table/index';

interface WatchlistProps {
  instruments?: any[];
}

const Watchlist: React.SFC<WatchlistProps> = ({instruments = []}) => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Bid</th>
        <th>Ask</th>
      </tr>
    </thead>
    <tbody>
      {instruments.map(i => {
        const dir = i.id % 2 === 0;
        const color = dir ? '#13b72a' : '#ff3e2e';
        return (
          <tr style={{color}} key={i.id}>
            <td>
              <Icon color={color} name={`arrow-${dir ? 'up' : 'down'}`} />&nbsp;{
                i.name
              }
            </td>
            <td>{i.bid.toFixed(2)}</td>
            <td>{i.ask.toFixed(2)}</td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);

export default Watchlist;
