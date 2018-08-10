import * as React from 'react';
import {Line, Text} from 'react-konva';

import {AssetModel, Order} from '../../../models';

import {formattedNumber} from '../../../utils/localFormatted/localFormatted';
import chart from './chartConstants';
import {measureText} from './chartHelpers';

export interface PointerProps {
  orders: Order[];
  side: string;
  points: number[];
  borders: number[];
  color: string;
  baseAsset: AssetModel;
  quoteAsset: AssetModel;
  width: number;
  height: number;
  quoteAccuracy: number;
  baseAccuracy: number;
  priceAccuracy: number;
}

class Pointer extends React.Component<PointerProps> {
  calcY: number = -chart.modal.height;
  mouseX: number = this.props.width * 2;

  orderIndex: number = 0;

  graphics: any = [];

  line: number[] = [0, 0, 0, this.props.height];
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
      fromMouseToRightSide > this.props.width
        ? (this.titleX = this.props.width - width + chart.modal.marginLeft)
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

    const aboveMidHeight = this.calcY < this.props.height * 0.4;

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
      fromMouseToRightSide > this.props.width
        ? (leftX = this.props.width - width + chart.modal.arrowWidth / 2)
        : (leftX =
            this.mouseX -
            chart.modal.arrowWidth / 2 -
            chart.modal.longBeforeArrow);
    } else {
      const fromMouseToLeftSide =
        this.mouseX - chart.modal.arrowWidth / 2 - chart.modal.shortBeforeArrow;
      fromMouseToLeftSide < 0 ? (leftX = 0) : (leftX = fromMouseToLeftSide);
    }

    const aboveMidHeight = this.calcY < this.props.height * 0.4;

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
    const xPoints = this.props.points.filter((value, index, ar) => {
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

    return this.props.points[yIndex];
  };

  updateLine = () => {
    this.calcY = this.calculateCurrentY(this.mouseX) || -chart.modal.height;
    this.line = [this.mouseX, this.calcY, this.mouseX, this.props.height];
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

  calculateExactPrice = (): number => {
    let exactPrice = 0;
    for (let i = 0; i < this.orderIndex + 1; i++) {
      const price = this.props.orders[i].price;
      const volume = this.props.orders[i].volume;

      exactPrice += price * volume;
    }
    return exactPrice;
  };

  drawPointer = () => {
    if (this.props.orders.length > 0) {
      const price = this.props.orders[this.orderIndex].price;
      const depth = this.props.orders[this.orderIndex].depth;

      const priceLabel = `${formattedNumber(price, this.props.priceAccuracy)} ${
        this.props.quoteAsset
      }`;
      const depthLabel = `${formattedNumber(depth, this.props.baseAccuracy)} ${
        this.props.baseAsset
      }`;
      const totalOfLabel = `${formattedNumber(
        this.calculateExactPrice(),
        this.props.quoteAccuracy
      )} ${this.props.quoteAsset}`;

      const depthLabelWidth = measureText(
        depthLabel,
        chart.modal.label.fontSize,
        chart.modal.label.fontFamily
      );
      const totalOfLableWidth = measureText(
        totalOfLabel,
        chart.modal.label.fontSize,
        chart.modal.label.fontFamily
      );

      this.generateModal(depthLabelWidth, totalOfLableWidth);
      this.generateModalText(depthLabelWidth, totalOfLableWidth);

      this.graphics.push(
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
          dashEnabled={false}
          shadowEnabled={false}
          perfectDrawEnabled={false}
          strokeHitEnabled={false}
          strokeScaleEnabled={false}
          listening={false}
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
          listening={false}
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
          dashEnabled={false}
          shadowEnabled={false}
          perfectDrawEnabled={false}
          strokeHitEnabled={false}
          strokeScaleEnabled={false}
          listening={false}
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
          shadowEnabled={false}
          listening={false}
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
          shadowEnabled={false}
          listening={false}
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
          shadowEnabled={false}
          listening={false}
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
          shadowEnabled={false}
          listening={false}
        />
      );
    }
  };

  initialize = () => {
    this.graphics = [];
    this.orderIndex = 0;
  };

  render() {
    this.initialize();
    this.updateLine();
    this.drawPointer();
    return this.graphics;
  }
}

export default Pointer;
