import * as React from 'react';
import {OrderBookItemProps} from '../';
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

const StyledRow = styled.tr`
  display: flex;
`;

const OrderBookItem: React.SFC<OrderBookItemProps> = ({
  ask,
  bestBid,
  bid,
  id,
  price,
  maxVolume
}) => {
  return (
    <StyledRow
      key={id}
      style={bestBid ? {background: 'rgba(0, 0, 0, 0.2)'} : {}}
    >
      <td
        style={{
          color: '#d070ff',
          position: 'relative',
          textAlign: 'right',
          width: '50%'
        }}
      >
        <Volume bg="#d070ff" val={bid / maxVolume * 100} align="right" />
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
        <Volume bg="#ffae2c" val={ask / maxVolume * 100} align="left" />
        {ask}
      </td>
    </StyledRow>
  );
};

export default OrderBookItem;
