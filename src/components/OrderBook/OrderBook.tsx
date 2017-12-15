import * as React from 'react';
import styled from '../styled';
import {Table} from '../Table/index';

let quotes: any[] = [];

for (let i = 0; i < 10; i++) {
  quotes = [
    ...quotes,
    {
      ask: i > 5 ? 0 : (Math.random() * 100).toFixed(),
      bid: i < 6 ? 0 : (Math.random() * 100).toFixed(),
      price: (Math.random() * 1000).toFixed(3)
    }
  ];
}

const Volume = styled.div`
  position: absolute;
  background: ${(props: any) => props.bg};
  height: 100%;
  width: ${(props: any) => `${props.val}%`};
  opacity: 0.1;
  ${(props: any) => `${props.align}: 0%`};
  top: 0;
` as any;

const OrderBook = ({items = quotes}) => (
  <Table>
    <thead>
      <tr>
        <th style={{textAlign: 'right'}}>Sell</th>
        <th>Price</th>
        <th style={{textAlign: 'left'}}>Buy</th>
      </tr>
    </thead>
    <tbody>
      {items.map((x, idx) => (
        <tr key={idx}>
          <td
            style={{
              color: '#d070ff',
              position: 'relative',
              textAlign: 'right',
              width: '50%'
            }}
          >
            <Volume bg="#d070ff" val={x.bid} align="right" />
            {x.bid}
          </td>
          <td style={{width: '100px'}}>{x.price}</td>
          <td
            style={{
              color: '#ffae2c',
              position: 'relative',
              textAlign: 'left',
              width: '50%'
            }}
          >
            <Volume bg="#ffae2c" val={x.ask} align="left" />
            {x.ask}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default OrderBook;
