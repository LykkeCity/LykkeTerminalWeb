import * as React from 'react';
import {Order, Side} from '../../models/index';
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

const diff = (num1: string, num2: string) => {
  if (num1 === num2) {
    return {sim: '', diff: num1};
  }
  let i = 0;
  let res = '';
  while (num1[i] === num2[i] && i < num1.length) {
    res += num1[i];
    i++;
  }
  return {sim: res, diff: num1.substr(i)};
};

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
  askLevel?: any;
  prevPrice: number;
  isAuth?: boolean;
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
  scrollComponent,
  prevPrice,
  isAuth = false,
  askLevel
}) => {
  const currentPrice = price.toFixed(priceAccuracy);
  const diffInPrice = diff(
    price.toLocaleString(undefined, {
      maximumFractionDigits: priceAccuracy
    }),
    prevPrice.toLocaleString(undefined, {
      maximumFractionDigits: priceAccuracy
    })
  );

  const ownOrders = connectedLimitOrders.length > 0;

  const handleHover = (e: React.MouseEvent<any>) => {
    const top = e.currentTarget.offsetTop - scrollComponent.getScrollTop() + 62;
    showMyOrders({
      position: {
        top: side === Side.Sell ? top : top + askLevel.offsetHeight + 63
      },
      orders: connectedLimitOrders,
      volume: orderVolume,
      onCancel: onOrderClick
    });
  };

  return (
    <StyledOrderRow onMouseEnter={handleHover}>
      <StyledPrice
        side={side}
        onClick={onPriceClick(+currentPrice)}
        isAuth={isAuth}
      >
        <span style={{opacity: 0.4}}>{diffInPrice.sim}</span>
        <span>{diffInPrice.diff}</span>
      </StyledPrice>
      <StyledVolume side={side} isAuth={isAuth}>
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
        {formattedNumber(valueToShow * price, priceAccuracy)}
      </StyledValue>
    </StyledOrderRow>
  );
};

export default OrderBookItem;
