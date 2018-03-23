import * as React from 'react';

import {observable} from 'mobx';

import Konva from 'konva';
import {Layer, Stage} from 'react-konva';

import Asks from './Asks';
import Bids from './Bids';
import Mesh from './Mesh';

import {Order, OrderBookDisplayType} from '../../../models';
import {ChartProps} from './Models';

class Chart extends React.Component<ChartProps> {
  @observable displayType = OrderBookDisplayType.Volume;

  asks: Order[];
  bids: Order[];
  mid: string;

  width = 1125;
  height = 549;

  constructor(props: ChartProps) {
    super(props);
  }

  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };

  initialize() {
    this.asks = this.props.asks;
    this.bids = this.props.bids;
    this.mid = this.props.mid;
  }

  render() {
    this.initialize();
    return (
      <Stage width={this.width} height={this.height}>
        <Layer clearBeforeDraw={true}>
          <Mesh />
          <Asks orders={this.asks} />
          <Bids orders={this.bids} />
        </Layer>
      </Stage>
    );
  }
}

export default Chart;
