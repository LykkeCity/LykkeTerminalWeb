import * as React from 'react';
import {Order, Side} from '../../../models/index';
import styled from '../../styled';

// tslint:disable-next-line:no-var-requires
// const {Flex} = require('grid-styled');

const colorBySide = (side: Side) =>
  side === Side.Sell ? '#d070ff' : '#ffae2c';

const alignBySide = (side: Side) => (side === Side.Sell ? 'right' : 'left');

const normalizeVolume = (volume: number, maxVolume: number) =>
  volume / maxVolume * 100;

const CommonCell = styled.td`
  flex-grow: 1;
`;

const VolumeCell = CommonCell.extend.attrs({
  style: (props: any) => ({
    color: colorBySide(props.side),
    textAlign: alignBySide(props.side)
  })
})`
  position: relative;
  min-width: 80px !important;
` as any;

const MidCell = styled(CommonCell)`
  width: 80px;
  text-align: center !important;
`;

const VolumeOverlay = styled.div.attrs({
  style: (props: any) => ({
    background: colorBySide(props.side),
    width: `${props.volume}%`,
    [alignBySide(props.side)]: '0%'
  })
})`
  position: absolute;
  top: 0;
  height: 100%;
  opacity: 0.1;
` as any;

const OrderRow = styled.tr`
  display: flex;
`;

const OrderBookItem: React.SFC<Order & {maxVolume?: number}> = ({
  id,
  price,
  volume,
  side,
  maxVolume = 100
}) => (
  <OrderRow>
    <VolumeCell side={side}>
      {side === Side.Sell && (
        <div>
          <VolumeOverlay
            side={side}
            volume={normalizeVolume(volume, maxVolume)}
          />
          {volume}
        </div>
      )}
    </VolumeCell>
    <MidCell>{price}</MidCell>
    <VolumeCell side={side}>
      {side === Side.Buy && (
        <div>
          <VolumeOverlay
            side={side}
            volume={normalizeVolume(volume, maxVolume)}
          />
          {volume}
        </div>
      )}
    </VolumeCell>
  </OrderRow>
);

export default OrderBookItem;
