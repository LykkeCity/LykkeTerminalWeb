import * as React from 'react';
import {Order, Side} from '../../../models/index';
import styled from '../../styled';

const colorBySide = (side: Side) =>
  side === Side.Sell ? '#d070ff' : '#ffae2c';

const alignBySide = (side: Side) => (side === Side.Sell ? 'right' : 'left');

const normalizeVolume = (
  volume: number,
  minVolume: number,
  maxVolume: number
) => {
  const minp = 10;
  const maxp = 100;

  if (volume === minVolume && volume === maxVolume) {
    return maxp;
  }

  if (volume === minVolume && minVolume !== maxVolume) {
    return minp;
  }

  if (volume === maxVolume && minVolume !== maxVolume) {
    return maxp;
  }

  const minv = Math.log(minVolume);
  const maxv = Math.log(maxVolume);

  const scale = (maxv - minv) / (maxp - minp);
  return (Math.log(volume) - minv) / scale + minp;
};

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
  width: 33%;
` as any;

const MidCell = styled(CommonCell)`
  width: 33%;
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
  align-items: center;
  border-bottom: solid 1px rgba(0, 0, 0, 0.08);
`;

interface OrderBookItemProps extends Order {
  accuracy: number;
  invertedAccuracy: number;
  maxVolume?: number;
  minVolume?: number;
}

const OrderBookItem: React.SFC<OrderBookItemProps> = ({
  id,
  price,
  volume,
  side,
  accuracy,
  invertedAccuracy,
  minVolume = 1,
  maxVolume = 100
}) => (
  <OrderRow>
    <VolumeCell side={side}>
      {side === Side.Sell && (
        <div>
          <VolumeOverlay
            side={side}
            volume={normalizeVolume(volume, minVolume, maxVolume)}
          />
          {volume.toFixed(accuracy)}
        </div>
      )}
    </VolumeCell>
    <MidCell>{price.toFixed(invertedAccuracy)}</MidCell>
    <VolumeCell side={side}>
      {side === Side.Buy && (
        <div>
          <VolumeOverlay
            side={side}
            volume={normalizeVolume(volume, minVolume, maxVolume)}
          />
          {volume.toFixed(accuracy)}
        </div>
      )}
    </VolumeCell>
  </OrderRow>
);

export default OrderBookItem;
