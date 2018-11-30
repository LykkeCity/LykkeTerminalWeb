import * as React from 'react';
import {IconContext} from 'react-icons';
import {FiMinus, FiPlus} from 'react-icons/fi';
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

export const DepthChart = ({
  mid,
  quoteAccuracy,
  format,
  zoomIn,
  zoomOut,
  isMaxZoom,
  isMinZoom
}: DepthChartProps) => (
  <FillHeight>
    <AbsoluteCentered>
      <Bar>
        <Button onClick={zoomOut} disabled={isMinZoom}>
          <IconContext.Provider value={{size: '1.2rem'}}>
            <FiMinus />
          </IconContext.Provider>
        </Button>
        <Figure>
          <FigureValue>{format(mid, quoteAccuracy)}</FigureValue>
          <FigureHint>Mid price</FigureHint>
        </Figure>
        <Button onClick={zoomIn} disabled={isMaxZoom}>
          <IconContext.Provider value={{size: '1.2rem'}}>
            <FiPlus />
          </IconContext.Provider>
        </Button>
      </Bar>
    </AbsoluteCentered>
    <FillHeight>
      <ChartWrapper />
    </FillHeight>
  </FillHeight>
);

export default DepthChart;
