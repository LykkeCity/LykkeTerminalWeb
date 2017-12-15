import * as React from 'react';
import {Icon} from '../Icon/index';
import {Table} from '../Table/index';

const Watchlist = () => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Bid</th>
        <th>Ask</th>
      </tr>
    </thead>
    <tbody>
      {new Array(7)
        .fill({
          a: 16100 * Math.random(),
          b: 15600 * Math.random(),
          s: 'BTCUSD'
        })
        .map((x: any, idx) => {
          const dir = idx % 2 === 0;
          const color = dir ? '#13b72a' : '#ff3e2e';
          return (
            <tr style={{color}} key={idx}>
              <td>
                <Icon color={color} name={`arrow-${dir ? 'up' : 'down'}`} />&nbsp;{
                  x.s
                }
              </td>
              <td>{x.b.toFixed(2)}</td>
              <td>{x.a.toFixed(2)}</td>
            </tr>
          );
        })}
    </tbody>
  </Table>
);

export default Watchlist;
