import * as React from 'react';
import {Order, Side} from '../../../models/index';
import styled from '../../styled';

// tslint:disable-next-line:no-var-requires
const {Box} = require('grid-styled');

const Volume = styled.div`
  position: absolute;
  background: ${(props: any) => props.bg};
  height: 100%;
  width: ${(props: any) => `${props.val}%`};
  opacity: 0.1;
  ${(props: any) => `${props.align}: 0%`};
  top: 0;
` as any;

const OrderBookItem: React.SFC<Order> = ({id, price, volume, side}) => (
  <Box key={id}>
    <td
      style={{
        color: '#d070ff',
        position: 'relative',
        textAlign: 'right',
        width: '50%'
      }}
    >
      {side === Side.Sell && (
        <Volume bg="#d070ff" val={Math.log(volume)} align="right" />
      )}
      {side === Side.Sell && volume}
    </td>
    <td style={{width: '100px'}}>{price}</td>
    <td
      style={{
        color: '#ffae2c',
        position: 'relative',
        textAlign: 'left',
        width: '50%'
      }}
    >
      {side === Side.Buy && (
        <Volume bg="#ffae2c" val={Math.log(volume)} align="left" />
      )}
      {side === Side.Buy && volume}
    </td>
  </Box>
);

export default OrderBookItem;
