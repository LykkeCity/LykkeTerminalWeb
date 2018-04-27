import * as React from 'react';
import {Order} from '../../models';
import {VBar} from '../Bar/Bar';
import {FAIcon} from '../Icon/Icon';
import {
  StyledBar,
  StyledGrouping,
  StyledPriceList,
  StyledWrapper
} from '../OrderBook/styles';
import ChartWrapper from './Chart/index';

const formatNumber = (
  num: number | string,
  accuracy: number,
  options?: object
) =>
  (isFinite(Number(num)) &&
    Number(num).toLocaleString(undefined, {
      maximumFractionDigits: accuracy,
      ...options
    })) ||
  '--';

interface DepthChartProps {
  asks: Order[];
  bids: Order[];
  mid: string;
  spread: string;
  lastTradePrice: number;
  span: number;
  priceAccuracy: number;
  onNextSpan: () => void;
  onPrevSpan: () => void;
}

class DepthChart extends React.Component<DepthChartProps> {
  constructor(props: DepthChartProps) {
    super(props);
  }

  render() {
    const {
      mid,
      spread,
      lastTradePrice,
      span,
      priceAccuracy,
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
          <StyledPriceList>
            <div className="price-list-container">
              <div className="price-container">
                <span>Mid price</span>
                <div>{mid}</div>
              </div>
              <VBar />
              <div className="price-container">
                <span>Spread</span>
                <div>{spread}%</div>
              </div>
              <VBar />
              <div className="price-container">
                <span>Last Trade Price</span>
                <div>{formatNumber(lastTradePrice, priceAccuracy)}</div>
              </div>
            </div>
          </StyledPriceList>
        </StyledBar>
        <StyledWrapper>
          <ChartWrapper />
        </StyledWrapper>
      </StyledWrapper>
    );
  }
}

export default DepthChart;
