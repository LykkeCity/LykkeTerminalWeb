import * as React from 'react';
import {Order} from '../../models/index';
import {normalizeVolume} from '../../utils';
import {
  StyledOrderRow,
  StyledPrice,
  StyledValue,
  StyledVolume,
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
      <StyledPrice onClick={onPriceClick(+currentPrice)}>
        {currentPrice}
      </StyledPrice>
      <StyledVolume side={side}>
        <div onClick={onDepthClick(+currentPrice, depth)}>
          <StyledVolumeOverlay
            side={side}
            volume={normalizeVolume(valueToShow, minValue, maxValue)}
          />
          {valueToShow.toFixed(volumeAccuracy)}
        </div>
      </StyledVolume>
      <StyledValue>{(valueToShow * price).toFixed(priceAccuracy)}</StyledValue>
    </StyledOrderRow>
  );
};

export default OrderBookItem;
