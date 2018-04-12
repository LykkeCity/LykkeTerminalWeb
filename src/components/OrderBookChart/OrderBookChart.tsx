import * as React from 'react';
import {Order} from '../../models';
import {VBar} from '../Bar/Bar';
import {FAIcon} from '../Icon/Icon';
import {StyledBar, StyledGrouping, StyledWrapper} from '../OrderBook/styles';
import ChartWrapper from './Chart';

interface OrderBookChartProps {
  asks: Order[];
  bids: Order[];
  mid: string;
  spread: string;
  lastTradePrice: string;
  span: number;
  onNextSpan: () => void;
  onPrevSpan: () => void;
}

class OrderBookChart extends React.Component<OrderBookChartProps> {
  constructor(props: OrderBookChartProps) {
    super(props);
  }

  render() {
    const {
      mid,
      spread,
      lastTradePrice,
      span,
      onNextSpan,
      onPrevSpan
    } = this.props;

    return (
      <StyledWrapper>
        <StyledBar>
          <StyledGrouping>
            Grouping:
            <button onClick={onPrevSpan}>
              <FAIcon name="minus" />
            </button>
            <div>
              <strong>{span}</strong>
            </div>
            <button onClick={onNextSpan}>
              <FAIcon name="plus" />
            </button>
          </StyledGrouping>
          <VBar />
          Mid price:&nbsp;<span>{mid}</span>
          <VBar />
          Spread:&nbsp;<span>{spread}</span>&nbsp;%
          <VBar />
          Last Trade Price:&nbsp;<span>{lastTradePrice}</span>
        </StyledBar>
        <StyledWrapper>
          <ChartWrapper />
        </StyledWrapper>
      </StyledWrapper>
    );
  }
}

export default OrderBookChart;
