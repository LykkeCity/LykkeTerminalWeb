import * as React from 'react';
import Icon from '../Icon/Icon';
import {Figure, FigureHint, FigureValue} from '../OrderBook/styles';
import ChartWrapper from './Chart/index';
import {AbsoluteCentered, Bar, Button, FillHeight} from './styles';

interface DepthChartProps {
  mid: number;
  quoteAccuracy: number;
  format: (num: number, accuracy: number) => string;
  zoomIn: () => void;
  zoomOut: () => void;
  isMaxZoom: boolean;
  isMinZoom: boolean;
}

class DepthChart extends React.Component<DepthChartProps> {
  constructor(props: DepthChartProps) {
    super(props);
  }

  render() {
    const {
      mid,
      quoteAccuracy,
      format,
      zoomIn,
      zoomOut,
      isMaxZoom,
      isMinZoom
    } = this.props;
    return (
      <FillHeight>
        <AbsoluteCentered>
          <Bar>
            <Button onClick={zoomOut} disabled={isMinZoom}>
              <Icon name={'minus'} />
            </Button>
            <Figure>
              <FigureValue>{format(mid, quoteAccuracy)}</FigureValue>
              <FigureHint>Mid price</FigureHint>
            </Figure>
            <Button onClick={zoomIn} disabled={isMaxZoom}>
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
