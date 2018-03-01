import * as React from 'react';
import {Order, Side} from '../../../models/index';
import styled from '../../styled';

const colorBySide = (side: Side) =>
  side === Side.Sell ? '#d070ff' : '#ffae2c';

const volumeColorBySide = (side: Side) =>
  side === Side.Sell ? '#ab00ff' : '#fb8f01';

const alignBySide = (side: Side) => (side === Side.Sell ? 'right' : 'left');
const marginBySide = (side: Side) =>
  side === Side.Sell ? 'marginLeft' : 'marginRight';

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

const VolumeValue = styled.div.attrs({
  style: (props: any) => ({
    background: volumeColorBySide(props.side)
  })
})`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  height: 100%;
  padding: 0 7px;

  &::before {
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }
` as any;

const AskVolume = styled(VolumeValue)`
  right: 5px;
  &::before {
    border-left: 5px solid #fb8f01;
    right: -4px;
  }
`;

const BidVolume = styled(VolumeValue)`
  &::before {
    border-right: 5px solid #ab00ff;
    left: -4px;
  }
`;

const CloseOrders = styled.div.attrs({
  style: (props: any) => ({
    [marginBySide(props.side)]: '5px'
  })
})`
  cursor: pointer;
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
  maxValue?: number;
  minValue?: number;
  valueToShow: number;
  orderVolume: number;
  onClick: any;
  connectedLimitOrders: string[];
}

const OrderBookItem: React.SFC<OrderBookItemProps> = ({
  id,
  price,
  valueToShow,
  side,
  accuracy,
  invertedAccuracy,
  minValue = 10,
  maxValue = 100,
  orderVolume,
  onClick,
  connectedLimitOrders
}) => (
  <OrderRow>
    <VolumeCell side={side}>
      {side === Side.Sell ? (
        <div>
          <VolumeOverlay
            side={side}
            volume={normalizeVolume(valueToShow, minValue, maxValue)}
          />
          {valueToShow.toFixed(accuracy)}
        </div>
      ) : (
        !!orderVolume &&
        side === Side.Buy && (
          <AskVolume side={side}>
            <CloseOrders side={side} onClick={onClick(connectedLimitOrders)}>
              &times;
            </CloseOrders>
            <div>{orderVolume}</div>
          </AskVolume>
        )
      )}
    </VolumeCell>
    <MidCell>{price.toFixed(invertedAccuracy)}</MidCell>
    <VolumeCell side={side}>
      {side === Side.Buy ? (
        <div>
          <VolumeOverlay
            side={side}
            volume={normalizeVolume(valueToShow, minValue, maxValue)}
          />
          {valueToShow.toFixed(accuracy)}
        </div>
      ) : (
        !!orderVolume &&
        side === Side.Sell && (
          <BidVolume side={side}>
            <div>{orderVolume}</div>
            <CloseOrders side={side} onClick={onClick(connectedLimitOrders)}>
              &times;
            </CloseOrders>
          </BidVolume>
        )
      )}
    </VolumeCell>
  </OrderRow>
);

export default OrderBookItem;
