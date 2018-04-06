import * as React from 'react';
import {Order} from '../../models';
import {VBar} from '../Bar/Bar';
import {StyledBar, StyledGrouping, StyledWrapper} from '../OrderBook/styles';
import Chart from './Chart/index';

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
            Grouping: <button onClick={onPrevSpan}>-</button>
            <strong>{span}</strong>
            <button onClick={onNextSpan}>+</button>
          </StyledGrouping>
          <VBar />
          Mid price:&nbsp;<span>{mid}</span>
          <VBar />
          Spread:&nbsp;<span>{spread}</span>&nbsp;%
          <VBar />
          Last Trade Price:&nbsp;<span>{lastTradePrice}</span>
        </StyledBar>
        <StyledWrapper>
          <Chart />
        </StyledWrapper>
      </StyledWrapper>
    );
  }
}

export default OrderBookChart;
