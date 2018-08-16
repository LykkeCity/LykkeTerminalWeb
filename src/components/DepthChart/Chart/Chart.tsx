import * as React from 'react';
import chart from '../../../constants/chartConstants';
import {DepthArea, DepthText, Order} from '../../../models';
import {defineCanvasScale} from '../../../utils/canvasUtils';
import {formattedNumber} from '../../../utils/localFormatted/localFormatted';
import {colors} from '../../styled';
import {
  COST_PADDING,
  DEPTH_PADDING,
  drawChartElements,
  FONT_SIZE,
  generatePoints,
  getAreaColor,
  getCurrentArea,
  getDepthText,
  getPopupCoords,
  IChartDrawingTools,
  IPoint,
  measureText,
  PRICE_FONT_SIZE,
  PRICE_PADDING,
  updatePointsForDrawing,
  VALUE_PADDING
} from '../helpers/chartHelpers';

interface ChartProps {
  asks: Order[];
  bids: Order[];
  width: number;
  height: number;
  canvasHeight: number;
  canvasWidth: number;
  quoteAccuracy: number;
  baseAccuracy: number;
  priceAccuracy: number;
  baseAssetName: string;
  quoteAssetName: string;
  calculateExactPrice: (area: DepthArea, index: number) => number;
  findOrder: (area: DepthArea, index: number) => Order;
  calculateOrderXInterval: (
    width: number,
    area: DepthArea
  ) => (index: number) => number;
  calculateOrderYInterval: (depth: number) => number;
  midXAsks: number;
  midXBids: number;
  askWidth: number;
}

class Chart extends React.Component<ChartProps> {
  pointsAsks: IPoint[] = [];
  pointsBids: IPoint[] = [];

  canvas: HTMLCanvasElement | null;
  canvasCtx: CanvasRenderingContext2D | null;
  memoWidth: number = 0;
  currentItemXIndex: number = -1;
  currentArea: DepthArea;
  drawTools: IChartDrawingTools;

  constructor(props: ChartProps) {
    super(props);
  }

  componentDidMount() {
    this.canvasCtx = this.canvas!.getContext('2d');
    defineCanvasScale(
      this.canvasCtx,
      this.canvas,
      this.props.canvasWidth,
      this.props.canvasHeight
    );

    window.requestAnimationFrame(() => {
      this.renderCanvas();
      this.forceUpdate();
    });

    this.canvas!.addEventListener('mouseleave', this.handleMouseLeave);
    this.canvas!.addEventListener('mousemove', this.handleMouseMove);
    this.drawTools = drawChartElements(this.canvasCtx!, () => this.currentArea);
  }

  componentWillReceiveProps({canvasWidth}: ChartProps) {
    window.requestAnimationFrame(() => {
      if (canvasWidth !== this.memoWidth) {
        this.memoWidth = canvasWidth;
        defineCanvasScale(
          this.canvasCtx,
          this.canvas,
          this.props.canvasWidth,
          this.props.canvasHeight
        );
      }
      this.renderCanvas();
      this.forceUpdate();
    });
  }

  handleMouseMove = (event: any) => {
    const {offsetX: x} = event;
    this.currentArea = getCurrentArea(x, this.props.midXBids);
    let points: IPoint;

    if (this.currentArea === DepthArea.Bid) {
      points = this.findPoints(this.pointsBids, x)!;
    } else {
      points = this.findPoints(this.pointsAsks, x)!;
    }

    if (points) {
      window.requestAnimationFrame(() => {
        this.renderCanvas(points.y, x);
        this.forceUpdate();
      });
    }
  };

  handleMouseLeave = () => {
    window.requestAnimationFrame(() => {
      this.renderCanvas();
      this.forceUpdate();
    });
  };

  findPoints = (points: IPoint[], x: number) => {
    const xPoints = points.map(p => p.x);
    xPoints.push(x);
    xPoints.sort((a, b) => a - b);
    const currentXPointIndex = xPoints.findIndex(i => i === x);
    this.currentItemXIndex =
      this.currentArea === DepthArea.Bid
        ? currentXPointIndex - 1
        : currentXPointIndex + 1;
    return points.find(p => p.x === xPoints[this.currentItemXIndex]);
  };

  drawAsks = () => {
    const {
      midXAsks,
      height: y,
      asks,
      calculateOrderXInterval,
      calculateOrderYInterval,
      askWidth,
      width: x,
      midXBids
    } = this.props;

    this.pointsAsks = generatePoints(
      midXAsks,
      y,
      asks,
      DepthArea.Ask,
      calculateOrderXInterval(askWidth, DepthArea.Ask),
      calculateOrderYInterval
    );

    const updatedPoints = updatePointsForDrawing(
      this.pointsAsks,
      chart.asks.lineColor,
      [{x, y}, {x: midXBids, y}]
    );

    this.drawTools.drawLevel(updatedPoints, chart.asks.fillColor);
  };

  drawBids = () => {
    const {
      midXBids,
      height: y,
      bids,
      calculateOrderXInterval,
      calculateOrderYInterval
    } = this.props;

    this.pointsBids = generatePoints(
      midXBids,
      y,
      bids,
      DepthArea.Bid,
      calculateOrderXInterval(midXBids, DepthArea.Bid),
      calculateOrderYInterval
    );

    const updatedPoints = updatePointsForDrawing(
      this.pointsBids,
      chart.bids.lineColor,
      [{x: 0, y}, {x: this.props.midXBids, y}]
    );

    this.drawTools.drawLevel(updatedPoints, chart.bids.fillColor);
  };

  drawPopup = (y: number, x: number) => {
    const {
      findOrder,
      priceAccuracy,
      baseAccuracy,
      quoteAccuracy,
      quoteAssetName,
      baseAssetName,
      midXBids,
      height
    } = this.props;

    this.drawTools.drawPointer(x, y);
    this.drawTools.drawPointerLine(this.props.height, x, y);

    const order = findOrder(
      this.currentArea,
      Math.floor(this.currentItemXIndex / 2)
    );
    if (order) {
      const depthLabel = getDepthText(this.currentArea);

      const priceValue = `${formattedNumber(
        order.price,
        priceAccuracy
      )} ${quoteAssetName}`;
      const depthValue = `${formattedNumber(
        order.depth,
        baseAccuracy
      )} ${baseAssetName}`;

      const costValue = `${formattedNumber(
        this.props.calculateExactPrice(
          this.currentArea,
          Math.floor(this.currentItemXIndex / 2)
        ),
        quoteAccuracy
      )} ${quoteAssetName}`;

      const priceMeasure = measureText(
        priceValue,
        PRICE_FONT_SIZE,
        chart.modal.label.fontFamily,
        this.canvasCtx!
      );
      const depthMeasure = measureText(
        `${depthLabel} ${depthValue}`,
        FONT_SIZE,
        chart.modal.label.fontFamily,
        this.canvasCtx!
      );
      const depthLabelMeasure = measureText(
        depthLabel,
        FONT_SIZE,
        chart.modal.label.fontFamily,
        this.canvasCtx!
      );
      const costMeasure = measureText(
        `${DepthText.Cost} ${costValue}`,
        FONT_SIZE,
        chart.modal.label.fontFamily,
        this.canvasCtx!
      );
      const costLabelMeasure = measureText(
        DepthText.Cost,
        FONT_SIZE,
        chart.modal.label.fontFamily,
        this.canvasCtx!
      );
      const maxValueWidth = Math.max(priceMeasure, depthMeasure, costMeasure);

      this.drawTools.drawPopup(
        getPopupCoords(
          x,
          y,
          maxValueWidth,
          this.currentArea,
          midXBids,
          height / 2
        )
      );

      const drawText = this.drawTools.drawText(
        x,
        y,
        this.currentArea,
        midXBids,
        height / 2,
        maxValueWidth
      );

      // draw price
      drawText(
        priceMeasure,
        priceValue,
        colors.white,
        PRICE_FONT_SIZE,
        PRICE_PADDING
      );

      // draw depth label
      drawText(
        depthLabelMeasure,
        depthLabel,
        getAreaColor(this.currentArea),
        FONT_SIZE,
        DEPTH_PADDING
      );

      // draw depth value
      drawText(
        depthMeasure,
        depthValue,
        colors.white,
        FONT_SIZE,
        DEPTH_PADDING,
        depthLabelMeasure + VALUE_PADDING
      );

      // draw cost label
      drawText(
        costLabelMeasure,
        DepthText.Cost,
        getAreaColor(this.currentArea),
        FONT_SIZE,
        COST_PADDING
      );

      // draw cost value
      drawText(
        costMeasure,
        costValue,
        colors.white,
        FONT_SIZE,
        COST_PADDING,
        costLabelMeasure + VALUE_PADDING
      );
    }
  };

  renderCanvas = (y?: number, x?: number) => {
    if (this.canvas) {
      this.canvasCtx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.drawAsks();
    this.drawBids();

    if (y && x) {
      this.drawPopup(y, x);
    }
  };

  setCanvasRef = (canvas: any) => (this.canvas = canvas);

  render() {
    return (
      <React.Fragment>
        <canvas
          width={this.props.canvasWidth}
          height={this.props.canvasHeight}
          ref={this.setCanvasRef}
        />
      </React.Fragment>
    );
  }
}

export default Chart;
