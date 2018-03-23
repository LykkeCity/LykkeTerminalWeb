import * as React from 'react';
import {Order, Side} from '../../models/index';
import {normalizeVolume} from '../../utils';
import {
  StyledAskVolume,
  StyledBidVolume,
  StyledCloseOrders,
  StyledMidCell,
  StyledOrderRow,
  StyledVolumeCell,
  StyledVolumeOverlay
} from './styles';

interface OrderBookItemProps extends Order {
  priceAccuracy: number;
  volumeAccuracy: number;
  maxValue?: number;
  minValue?: number;
  valueToShow: number;
  onPriceClick: any;
  onDepthClick: any;
  onOrderClick: any;
  depth: number;
  orderVolume: number;
  connectedLimitOrders: string[];
}

const OrderBookItem: React.SFC<OrderBookItemProps> = ({
  id,
  price,
  valueToShow,
  side,
  priceAccuracy,
  volumeAccuracy,
  minValue = 10,
  maxValue = 100,
  orderVolume,
  connectedLimitOrders,
  depth,
  onPriceClick,
  onDepthClick,
  onOrderClick
}) => {
  const currentPrice = price.toFixed(priceAccuracy);
  return (
    <StyledOrderRow>
      <StyledVolumeCell side={side}>
        {side === Side.Sell ? (
          <div onClick={onDepthClick(+currentPrice, depth)}>
            <StyledVolumeOverlay
              side={side}
              volume={normalizeVolume(valueToShow, minValue, maxValue)}
            />
            {valueToShow.toFixed(volumeAccuracy)}
          </div>
        ) : (
          !!orderVolume &&
          side === Side.Buy && (
            <StyledAskVolume side={side}>
              <StyledCloseOrders
                side={side}
                onClick={onOrderClick(connectedLimitOrders)}
              >
                &times;
              </StyledCloseOrders>
              <div>{orderVolume}</div>
            </StyledAskVolume>
          )
        )}
      </StyledVolumeCell>
      <StyledMidCell onClick={onPriceClick(+currentPrice)}>
        {currentPrice}
      </StyledMidCell>
      <StyledVolumeCell side={side}>
        {side === Side.Buy ? (
          <div onClick={onDepthClick(+currentPrice, depth)}>
            <StyledVolumeOverlay
              side={side}
              volume={normalizeVolume(valueToShow, minValue, maxValue)}
            />
            {valueToShow.toFixed(volumeAccuracy)}
          </div>
        ) : (
          !!orderVolume &&
          side === Side.Sell && (
            <StyledBidVolume side={side}>
              <div>{orderVolume}</div>
              <StyledCloseOrders
                side={side}
                onClick={onOrderClick(connectedLimitOrders)}
              >
                &times;
              </StyledCloseOrders>
            </StyledBidVolume>
          )
        )}
      </StyledVolumeCell>
    </StyledOrderRow>
  );
};

export default OrderBookItem;
