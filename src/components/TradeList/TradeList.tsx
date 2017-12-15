import * as React from 'react';
import {Table} from '../Table/index';

let mockTrades: any[] = [];
for (let i = 0; i < 6; i++) {
  mockTrades = [
    ...mockTrades,
    {
      p: (Math.random() * 1000).toFixed(3),
      q: Math.floor(Math.random() * 10),
      s: `AB${i}XY${i + 1}`,
      side: i % 2 === 0 ? 'Buy' : 'Sell',
      t: new Date().toLocaleTimeString()
    }
  ];
}

interface TradeListProps {
  trades?: any[];
}

const TradeList: React.SFC<TradeListProps> = ({trades = mockTrades}) => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Side</th>
        <th>Qnt</th>
        <th>Price</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      {trades.map((x: any, idx) => (
        <tr key={idx}>
          <td>{x.s}</td>
          <td style={{color: x.side === 'Buy' ? '#fb8f01' : '#d070ff'}}>
            {x.side}
          </td>
          <td>{x.q}</td>
          <td>{x.p}</td>
          <td>{x.t}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default TradeList;
