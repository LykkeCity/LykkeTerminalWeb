import {observable} from 'mobx';
import * as React from 'react';
import {OrderBookDisplayType} from '../../models';
import {VBar} from '../Bar/Bar';
import {StyledBar, StyledGrouping, StyledWrapper} from '../OrderBook/styles';
import Chart from './Chart';

interface OrderBookChartProps {
  mid: string;
  spread: string;
  lastTradePrice: string;
  span: number;
  onNextSpan: () => void;
  onPrevSpan: () => void;
}

class OrderBookChart extends React.Component<OrderBookChartProps> {
  @observable displayType = OrderBookDisplayType.Volume;

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
          <StyledGrouping>
            Mid price: <span>{mid}</span>
            <VBar />
            Spread: <span>{spread}</span>%
            <VBar />
            Last Trade Price: <span>{lastTradePrice}</span>
          </StyledGrouping>
        </StyledBar>
        <StyledWrapper>
          <Chart />
        </StyledWrapper>
      </StyledWrapper>
    );
  }
}

export default OrderBookChart;
