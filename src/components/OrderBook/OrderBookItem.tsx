import * as React from 'react';
import {Order} from '../../models/index';
import {normalizeVolume} from '../../utils';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {
  MyOrdersIndicator,
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
  showMyOrders: any;
  scrollComponent?: any;
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
  onOrderClick,
  showMyOrders,
  scrollComponent
}) => {
  const currentPrice = price.toFixed(priceAccuracy);
  const ownOrders = connectedLimitOrders.length > 0;
  return (
    <StyledOrderRow
      // tslint:disable-next-line:jsx-no-lambda
      onMouseEnter={e =>
        showMyOrders({
          position: {
            top: e.currentTarget.offsetTop - scrollComponent.getScrollTop() + 62
          },
          orders: connectedLimitOrders,
          volume: orderVolume,
          onCancel: onOrderClick
        })
      }
    >
      <StyledPrice onClick={onPriceClick(+currentPrice)}>
        {(+currentPrice).toLocaleString(undefined, {
          maximumFractionDigits: priceAccuracy
        })}
      </StyledPrice>
      <StyledVolume side={side}>
        <div onClick={onDepthClick(+currentPrice, depth)}>
          {ownOrders && <MyOrdersIndicator side={side} />}
          <StyledVolumeOverlay
            side={side}
            volume={normalizeVolume(valueToShow, minValue, maxValue)}
          />
          {formattedNumber(valueToShow, volumeAccuracy)}
        </div>
      </StyledVolume>
      <StyledValue>
        {(valueToShow * price).toLocaleString(undefined, {
          maximumFractionDigits: priceAccuracy
        })}
      </StyledValue>
    </StyledOrderRow>
  );
};

export default OrderBookItem;
