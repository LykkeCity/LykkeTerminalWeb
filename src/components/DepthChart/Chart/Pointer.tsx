import * as React from 'react';

import {Circle, Line, Text} from 'react-konva';

import {Order} from '../../../models';
import {PointerProps} from './Models';

import chart from './chartConstants';

class Pointer extends React.Component<PointerProps> {
  calcY: number = -chart.modal.height;
  mouseX: number = -chart.modal.width;

  orders: Order[];
  orderIndex: number = 0;

  graphics: any = [];
  points: number[] = [];

  width: number = -1;
  height: number = -1;

  borders: number[] = [];
  line: number[] = [0, 0, 0, this.height];
  modal: number[] = [];
  titleX: number;
  titleY: number;
  text: string;

  soldX: number;
  totalX: number;
  labelsY: number;
  numbersY: number;

  modalLine: number[] = [];

  constructor(props: PointerProps) {
    super(props);
  }

  generateModalText(): any {
    if (this.props.side === 'asks') {
      this.titleX =
        this.mouseX -
        chart.modal.arrowWidth / 2 -
        chart.modal.longBeforeArrow +
        chart.modal.marginLeft;
      this.text = 'Can be bought';
    } else {
      this.titleX =
        this.mouseX -
        chart.modal.arrowWidth / 2 -
        chart.modal.shortBeforeArrow +
        chart.modal.marginLeft;
      this.text = 'Can be sold';
    }

    this.titleY = this.calcY - chart.modal.arrowHeight - chart.modal.height;

    this.modalLine = [
      this.titleX,
      this.titleY + 32,
      this.titleX + (chart.modal.width - chart.modal.marginLeft * 2),
      this.titleY + 32
    ];

    this.soldX = this.titleX;
    this.totalX = this.titleX + chart.modal.width / 2;
    this.labelsY = this.titleY + 48;
    this.numbersY = this.labelsY + 24;
  }

  generateModal() {
    this.modal = [];
    let leftX;
    if (this.props.side === 'asks') {
      leftX =
        this.mouseX - chart.modal.arrowWidth / 2 - chart.modal.longBeforeArrow;
    } else {
      leftX =
        this.mouseX - chart.modal.arrowWidth / 2 - chart.modal.shortBeforeArrow;
    }
    const rightX = leftX + chart.modal.width;
    const bottomY =
      this.calcY - chart.modal.shiftFromBall - chart.modal.arrowHeight;
    const topY = bottomY - chart.modal.height;

    this.modal.push(this.mouseX, this.calcY - chart.modal.shiftFromBall);
    this.modal.push(this.mouseX - chart.modal.arrowWidth / 2, bottomY);
    this.modal.push(leftX, bottomY);
    this.modal.push(leftX, topY);
    this.modal.push(rightX, topY);
    this.modal.push(rightX, bottomY);
    this.modal.push(this.mouseX + chart.modal.arrowWidth / 2, bottomY);
  }

  calculateCurrentY = (mouseX: number) => {
    const xPoints = this.points.filter((value, index, ar) => {
      return index % 2 === 0;
    });

    let xIndex = 0;

    if (this.props.side === 'asks') {
      xIndex = xPoints.findIndex(value => {
        return value > mouseX;
      });
    } else {
      xIndex = xPoints.findIndex(value => {
        return value < mouseX;
      });
    }

    if (xIndex <= 0) {
      this.orderIndex = 0;
    } else {
      this.orderIndex = xIndex / 2 - 1;
    }

    const yIndex = xIndex * 2 + 1;

    return this.points[yIndex];
  };

  updateLine = () => {
    this.calcY = this.calculateCurrentY(this.mouseX) || -chart.modal.height;
    this.line = [this.mouseX, this.calcY, this.mouseX, this.height];
  };

  handleMouseMove = (event: any) => {
    const mouseX = event.target.getStage().getPointerPosition().x;
    if (Math.ceil(this.mouseX) !== Math.ceil(mouseX)) {
      this.mouseX = mouseX;
      this.forceUpdate();
    }
  };

  handleMouseLeave = (event: any) => {
    this.mouseX = -chart.modal.width;
    this.calcY = -chart.modal.height;
    this.orderIndex = 0;
    this.forceUpdate();
  };

  drawPointer = () => {
    let price = 0;
    let depth = 0;

    if (this.orders.length > 0) {
      price = this.orders[this.orderIndex].price;
      depth = this.orders[this.orderIndex].depth;

      this.graphics.push(
        // invisible borders under a chart
        <Line
          points={[
            this.borders[0],
            this.borders[1],
            this.borders[0],
            this.borders[3],
            this.borders[2],
            this.borders[3],
            this.borders[2],
            this.borders[1]
          ]}
          closed={true}
          onMouseMove={this.handleMouseMove}
          onMouseOver={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />,
        // ball
        <Circle
          x={this.mouseX}
          y={this.calcY}
          fill={this.props.color}
          stroke={chart.pointer.circleStrokeColor}
          radius={chart.pointer.circleRadius}
          onMouseMove={this.handleMouseMove}
          onMouseOver={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />,
        // dashed line under the ball
        <Line
          points={this.line}
          closed={false}
          stroke={this.props.color}
          strokeWidth={chart.strokeWidth}
          dash={chart.pointer.dash}
          onMouseMove={this.handleMouseMove}
          onMouseOver={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />,
        // modal window
        <Line
          points={this.modal}
          closed={true}
          stroke={chart.modal.strokeColor}
          strokeWidth={chart.modal.strokeWidth}
          fill={chart.modal.fillColor}
          onMouseMove={this.handleMouseMove}
          onMouseOver={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />,
        // title text
        <Text
          text={`${price.toLocaleString(undefined, {
            maximumFractionDigits: this.props.priceAccuracy
          })} ${this.props.quoteAsset}`}
          fontSize={chart.modal.title.fontSize}
          fontFamily={chart.modal.title.fontFamily}
          fontStyle={chart.modal.title.fontStyle}
          fill={chart.modal.title.fontColor}
          x={this.titleX}
          y={this.titleY}
          onMouseMove={this.handleMouseMove}
          onMouseOver={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />,
        // line under the title
        <Line
          points={this.modalLine}
          closed={true}
          stroke={this.props.color}
          strokeWidth={chart.strokeWidth}
          dash={chart.pointer.dash}
          onMouseMove={this.handleMouseMove}
          onMouseOver={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />,
        // labels
        <Text
          text={this.text}
          fontSize={chart.modal.label.fontSize}
          fontFamily={chart.modal.label.fontFamily}
          fontStyle={chart.modal.label.fontStyle}
          fill={chart.modal.label.fontColor}
          x={this.soldX}
          y={this.labelsY}
          onMouseMove={this.handleMouseMove}
          onMouseOver={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />,
        <Text
          text="For a total of"
          fontSize={chart.modal.label.fontSize}
          fontFamily={chart.modal.label.fontFamily}
          fontStyle={chart.modal.label.fontStyle}
          fill={chart.modal.label.fontColor}
          x={this.totalX}
          y={this.labelsY}
          onMouseMove={this.handleMouseMove}
          onMouseOver={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />,
        // numbers
        <Text
          text={`${depth.toLocaleString(undefined, {
            maximumFractionDigits: this.props.priceAccuracy
          })} ${this.props.baseAsset}`}
          fontSize={chart.modal.number.fontSize}
          fontFamily={chart.modal.number.fontFamily}
          fontStyle={chart.modal.number.fontStyle}
          fill={chart.modal.number.fontColor}
          x={this.soldX}
          y={this.numbersY}
          onMouseMove={this.handleMouseMove}
          onMouseOver={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />,
        <Text
          text={`${(depth * price).toLocaleString(undefined, {
            maximumFractionDigits: this.props.priceAccuracy
          })} ${this.props.quoteAsset}`}
          fontSize={chart.modal.number.fontSize}
          fontFamily={chart.modal.number.fontFamily}
          fontStyle={chart.modal.number.fontStyle}
          fill={chart.modal.number.fontColor}
          x={this.totalX}
          y={this.numbersY}
          onMouseMove={this.handleMouseMove}
          onMouseOver={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />
      );
    }
  };

  initialize = () => {
    this.graphics = [];
    this.orderIndex = 0;
    this.width = this.props.width;
    this.height = this.props.height;
    this.orders = this.props.orders;
    this.borders = this.props.borders;
    this.points = this.props.points;
  };

  render() {
    this.initialize();
    this.updateLine();
    this.generateModal();
    this.generateModalText();
    this.drawPointer();
    return this.graphics;
  }
}

export default Pointer;
