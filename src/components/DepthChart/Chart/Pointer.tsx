import * as React from 'react';
import {Circle, Line, Text} from 'react-konva';
import {Order} from '../../../models';
import formattedNumber from '../../../utils/localFormatted/localFormatted';
import chart from './chartConstants';
import {PointerProps} from './Models';

const measureText = (text: string, size: number, font: string) => {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `${size}px ${font}`;
  return Math.ceil(ctx!.measureText(text).width);
};

class Pointer extends React.Component<PointerProps> {
  calcY: number = -chart.modal.height;
  mouseX: number = this.props.width * 2;

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

  generateModalText(depthLabelWidth: number, totalOfLabelWidth: number): any {
    const width = Math.max(
      depthLabelWidth + totalOfLabelWidth + chart.modal.marginLeft * 3,
      chart.modal.width
    );

    if (this.props.side === 'asks') {
      const fromMouseToRightSide =
        this.mouseX +
        (width - (chart.modal.arrowWidth / 2 + chart.modal.longBeforeArrow));
      fromMouseToRightSide > this.width
        ? (this.titleX = this.width - width + chart.modal.marginLeft)
        : (this.titleX =
            this.mouseX -
            chart.modal.arrowWidth / 2 -
            chart.modal.longBeforeArrow +
            chart.modal.marginLeft);

      this.text = 'Can be bought';
    } else {
      const fromMouseToLeftSide =
        this.mouseX - chart.modal.arrowWidth / 2 - chart.modal.shortBeforeArrow;
      fromMouseToLeftSide < 0
        ? (this.titleX = chart.modal.marginLeft)
        : (this.titleX = fromMouseToLeftSide + chart.modal.marginLeft);

      this.text = 'Can be sold';
    }

    const aboveMidHeight = this.calcY < this.height * 0.4;

    this.titleY = aboveMidHeight
      ? this.calcY + chart.modal.arrowHeight + 20
      : this.calcY - chart.modal.arrowHeight - chart.modal.height;

    this.modalLine = [
      this.titleX,
      this.titleY + 32,
      this.titleX + (width - chart.modal.marginLeft * 2),
      this.titleY + 32
    ];

    this.soldX = this.titleX;
    this.totalX =
      this.titleX +
      Math.max(depthLabelWidth + chart.modal.marginLeft, chart.modal.width / 2);
    this.labelsY = this.titleY + 48;
    this.numbersY = this.labelsY + 24;
  }

  generateModal(depthLabelWidth: number, totalOfLabelWidth: number) {
    const width = Math.max(
      depthLabelWidth + totalOfLabelWidth + chart.modal.marginLeft * 3,
      chart.modal.width
    );

    if (this.calcY < 0) {
      this.calcY = this.calcY - 10000;
    }
    this.modal = [];
    let leftX;
    if (this.props.side === 'asks') {
      const fromMouseToRightSide =
        this.mouseX +
        (width - (chart.modal.arrowWidth / 2 + chart.modal.longBeforeArrow));
      fromMouseToRightSide > this.width
        ? (leftX = this.width - width + chart.modal.arrowWidth / 2)
        : (leftX =
            this.mouseX -
            chart.modal.arrowWidth / 2 -
            chart.modal.longBeforeArrow);
    } else {
      const fromMouseToLeftSide =
        this.mouseX - chart.modal.arrowWidth / 2 - chart.modal.shortBeforeArrow;
      fromMouseToLeftSide < 0 ? (leftX = 0) : (leftX = fromMouseToLeftSide);
    }

    const aboveMidHeight = this.calcY < this.height * 0.4;

    const rightX = leftX + width;
    const bottomY = aboveMidHeight
      ? this.calcY + chart.modal.shiftFromBall + chart.modal.arrowHeight
      : this.calcY - chart.modal.shiftFromBall - chart.modal.arrowHeight;
    const topY = aboveMidHeight
      ? bottomY + chart.modal.height
      : bottomY - chart.modal.height;

    this.modal.push(
      this.mouseX,
      aboveMidHeight
        ? this.calcY + chart.modal.shiftFromBall
        : this.calcY - chart.modal.shiftFromBall
    );

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
    if (this.orders.length > 0) {
      const price = this.orders[this.orderIndex].price;
      const depth = this.orders[this.orderIndex].depth;

      const priceLabel = `${formattedNumber(price, this.props.priceAccuracy)} ${
        this.props.quoteAsset
      }`;
      const depthLabel = `${formattedNumber(depth, this.props.baseAccuracy)} ${
        this.props.baseAsset
      }`;
      const totalOfLabel = `${formattedNumber(
        price * depth,
        this.props.quoteAccuracy
      )} ${this.props.quoteAsset}`;

      const depthLabelWidth = measureText(
        depthLabel,
        chart.modal.title.fontSize,
        chart.modal.title.fontFamily
      );
      const totalOfLableWidth = measureText(
        totalOfLabel,
        chart.modal.title.fontSize,
        chart.modal.title.fontFamily
      );

      this.generateModal(depthLabelWidth, totalOfLableWidth);
      this.generateModalText(depthLabelWidth, totalOfLableWidth);

      this.graphics.push(
        // invisible borders under a chart
        <Line
          key="border"
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
          key="circle"
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
          key="line-1"
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
          key="line-2"
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
          key="title"
          text={priceLabel}
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
          key="line-3"
          points={this.modalLine}
          closed={true}
          stroke={this.props.color}
          strokeWidth={chart.strokeWidth}
          onMouseMove={this.handleMouseMove}
          onMouseOver={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />,
        // labels
        <Text
          key="text-2"
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
          key="text-3"
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
          key="text-4"
          text={depthLabel}
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
          key="text-5"
          text={totalOfLabel}
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
    this.drawPointer();
    return this.graphics;
  }
}

export default Pointer;
