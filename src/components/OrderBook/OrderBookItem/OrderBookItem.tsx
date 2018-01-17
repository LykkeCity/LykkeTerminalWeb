import * as React from 'react';
import {Order, Side} from '../../../models/index';
import styled from '../../styled';

// tslint:disable-next-line:no-var-requires
// const {Flex} = require('grid-styled');

const colorBySide = (side: Side) =>
  side === Side.Sell ? '#d070ff' : '#ffae2c';

const alignBySide = (side: Side) => (side === Side.Sell ? 'right' : 'left');

const CommonCell = styled.td`
  flex-grow: 1;
`;

const VolumeCell = styled(CommonCell)`
  color: ${(p: any) => colorBySide(p.side)} !important;
  text-align: ${(p: any) => alignBySide(p.side)} !important;
  position: relative;
  min-width: 80px !important;
` as any;

const MidCell = styled(CommonCell)`
  width: 80px;
  text-align: center !important;
`;

const VolumeOverlay = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  opacity: 0.1;
  background: ${(p: any) => colorBySide(p.side)};
  width: ${(p: any) => `${p.volume}%`};
  ${(p: any) => `${alignBySide(p.side)}: 0%`};
` as any;

const OrderRow = styled.tr`
  display: flex;
`;

const OrderBookItem: React.SFC<Order> = ({id, price, volume, side}) => (
  <OrderRow>
    <VolumeCell side={side}>
      {side === Side.Sell && (
        <div>
          <VolumeOverlay side={side} volume={Math.log(volume) * 10} />
          {volume}
        </div>
      )}
    </VolumeCell>
    <MidCell>{price}</MidCell>
    <VolumeCell side={side}>
      {side === Side.Buy && (
        <div>
          <VolumeOverlay side={side} volume={Math.log(volume) * 10} />
          {volume}
        </div>
      )}
    </VolumeCell>
  </OrderRow>
);

export default OrderBookItem;
