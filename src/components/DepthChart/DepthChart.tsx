import * as React from 'react';
import {FAIcon} from '../Icon/Icon';
import {Figure, FigureHint, FigureValue} from '../OrderBook/styles';
import ChartWrapper from './Chart/index';
import {AbsoluteCentered, Bar, Button, FillHeight} from './styles';

interface DepthChartProps {
  mid: number;
  priceAccuracy: number;
  format: (num: number, accuracy: number) => string;
  onNextSpan: () => void;
  onPrevSpan: () => void;
}

class DepthChart extends React.Component<DepthChartProps> {
  constructor(props: DepthChartProps) {
    super(props);
  }

  render() {
    const {mid, priceAccuracy, format, onNextSpan, onPrevSpan} = this.props;
    return (
      <FillHeight>
        <AbsoluteCentered>
          <Bar>
            <Button onClick={onPrevSpan}>
              <FAIcon name="minus" />
            </Button>
            <Figure>
              <FigureValue>{format(mid, priceAccuracy)}</FigureValue>
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
