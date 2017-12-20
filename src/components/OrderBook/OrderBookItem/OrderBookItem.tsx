import * as React from 'react';
import {OrderBookItemInterface} from '../';
import styled from '../../styled';

const Volume = styled.div`
  position: absolute;
  background: ${(props: any) => props.bg};
  height: 100%;
  width: ${(props: any) => `${props.val}%`};
  opacity: 0.1;
  ${(props: any) => `${props.align}: 0%`};
  top: 0;
` as any;

const OrderBookItem: React.SFC<OrderBookItemInterface> = ({
  ask,
  bid,
  id,
  price
}) => {
  return (
    <tr key={id}>
      <td
        style={{
          color: '#d070ff',
          position: 'relative',
          textAlign: 'right',
          width: '50%'
        }}
      >
        <Volume bg="#d070ff" val={bid} align="right" />
        {bid}
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
        <Volume bg="#ffae2c" val={ask} align="left" />
        {ask}
      </td>
    </tr>
  );
};

export default OrderBookItem;
