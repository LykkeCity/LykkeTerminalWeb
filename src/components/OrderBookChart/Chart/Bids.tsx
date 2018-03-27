import * as React from 'react';

import {Line, Rect} from 'react-konva';

import {Order} from '../../../models';

import {ChartProps} from './Models';

import chart from './chartConstants';

class Bids extends React.Component<ChartProps> {
  graphics: any = [];
  width: number = 1080;
  height: number = 500;
  asks: Order[];
  bids: Order[];
  mid: number;

  midX = this.width / 2 - Math.round(chart.strokeWidth / 2);
  midY = this.height;

  coef: number;

  constructor(props: ChartProps) {
    super(props);
  }

  showMessage(ask: Order, index: number) {
    // tslint:disable-next-line:no-console
    console.log(`${index}: ${ask.price}`);
  }

  calculateStepLength(bid: Order, index: number) {
    const prevPrice = this.bids[index - 1]
      ? this.bids[index - 1].price
      : this.mid;
    return (
      (bid.price - prevPrice) *
      this.midX /
      (this.bids[this.bids.length - 1].price - this.mid)
    );
  }

  calculateStepHeight(bid: Order) {
    return this.coef * Math.ceil(bid.depth);
  }

  drawBids = () => {
    let currentX = this.midX;
    let currentY = this.midY;
    let newX = this.midX;
    let newY = this.midY;
    this.bids.forEach((bid, index) => {
      newX = currentX - this.calculateStepLength(bid, index);
      newY = this.midY - this.calculateStepHeight(bid);
      // tslint:disable-next-line:no-console
      console.log(`${index}: ${bid.price}`);
      this.graphics.push(
        <Line
          points={[currentX, currentY, currentX, newY, newX, newY]}
          closed={false}
          stroke={chart.bids.lineColor}
          strokeWidth={chart.strokeWidth}
          // tslint:disable-next-line:jsx-no-lambda
          onMouseOver={() => this.showMessage(bid, index)}
        />
      );
      this.graphics.push(
        <Rect
          x={newX}
          y={newY}
          width={currentX - newX}
          height={this.midY - newY}
          stroke={chart.bids.fillStrokeColor}
          fill={chart.bids.fillColor}
          // tslint:disable-next-line:jsx-no-lambda
          onMouseOver={() => this.showMessage(bid, index)}
        />
      );
      currentX = newX;
      currentY = newY;
    });
  };

  calculateCoef() {
    if (this.asks[this.asks.length - 1] && this.asks[this.asks.length - 1]) {
      const maxDepth = Math.max(
        this.asks[this.asks.length - 1].depth,
        this.bids[this.bids.length - 1].depth
      );
      return this.height / (maxDepth + 5);
    } else {
      return 1;
    }
  }

  initialize() {
    this.graphics = [];
    this.asks = this.props.asks;
    this.bids = this.props.bids;
    this.mid = parseFloat(this.props.mid);
    this.coef = this.calculateCoef();
  }

  render() {
    this.initialize();
    this.drawBids();
    return this.graphics;
  }
}

export default Bids;
