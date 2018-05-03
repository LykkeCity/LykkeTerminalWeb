import * as React from 'react';
import {Order} from '../../models';
import {FAIcon} from '../Icon/Icon';
import {Figure, FigureHint, FigureValue} from '../OrderBook/styles';
import ChartWrapper from './Chart/index';
import {AbsoluteCentered, Bar, Button, FillHeight} from './styles';

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
    const {mid, onNextSpan, onPrevSpan} = this.props;
    return (
      <FillHeight>
        <AbsoluteCentered>
          <Bar>
            <Button onClick={onPrevSpan}>
              <FAIcon name="minus" />
            </Button>
            <Figure>
              <FigureValue>{mid}</FigureValue>
              <FigureHint>Mid price</FigureHint>
            </Figure>
            <Button onClick={onNextSpan}>
              <FAIcon name="plus" />
            </Button>
          </Bar>
        </AbsoluteCentered>
        <FillHeight>
          <ChartWrapper />
        </FillHeight>
      </FillHeight>
    );
  }
}

export default DepthChart;
