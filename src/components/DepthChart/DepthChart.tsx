import * as React from 'react';
import {Icon} from '../Icon';
import {Figure, FigureHint, FigureValue} from '../OrderBook/styles';
import ChartWrapper from './Chart/index';
import {AbsoluteCentered, Bar, Button, FillHeight} from './styles';

interface DepthChartProps {
  mid: number;
  quoteAccuracy: number;
  format: (num: number, accuracy: number) => string;
  onNextSpan: () => void;
  onPrevSpan: () => void;
}

class DepthChart extends React.Component<DepthChartProps> {
  constructor(props: DepthChartProps) {
    super(props);
  }

  render() {
    const {mid, quoteAccuracy, format, onNextSpan, onPrevSpan} = this.props;
    return (
      <FillHeight>
        <AbsoluteCentered>
          <Bar>
            <Button onClick={onPrevSpan}>
              <Icon name={'minus'} />
            </Button>
            <Figure>
              <FigureValue>{format(mid, quoteAccuracy)}</FigureValue>
              <FigureHint>Mid price</FigureHint>
            </Figure>
            <Button onClick={onNextSpan}>
              <Icon name={'plus'} />
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
