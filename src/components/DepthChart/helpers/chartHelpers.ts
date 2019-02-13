import chart, {
  MESH_LINES_OPACITY,
  POINTER_OPACITY,
  POPUP_ALIGN,
  POPUP_HEIGHT,
  POPUP_TEXT_PADDING
} from '../../../constants/chartConstants';
import {DepthArea, DepthText, Order} from '../../../models/index';
import {
  drawArea,
  drawCircle,
  drawLine,
  drawText,
  drawVerticalLine
} from '../../../utils/canvasUtils';
import {colors} from '../../styled';

export const getAreaColor = (area: DepthArea) =>
  area === DepthArea.Bid ? colors.buy : colors.sell;

export interface IPoint {
  x: number;
  y: number;
  color?: string;
}

export interface IChartDrawingTools {
  drawPointer: (x: number, y: number) => void;
  drawLevel: (points: IPoint[], fillColor: string) => void;
  drawPointerLine: (height: number, x: number, y: number) => void;
  drawPopup: (points: IPoint[]) => void;
  drawText: (
    x: number,
    y: number,
    area: DepthArea,
    midX: number,
    midY: number,
    endXPoint: number
  ) => (
    textWidth: number,
    text: number | string,
    color: string,
    fontSize: number,
    padding: number,
    labelWidth?: number
  ) => void;
}

export interface IMeshDrawingTools {
  drawHorizontalLine: (width: number, y: number) => void;
  drawMid: (x: number, height: number) => void;
  drawVerticalLine: (x: number, height: number) => void;
  drawLabel: (text: string, x: number, y: number, font: string) => void;
}

export const measureText = (
  text: string,
  size: number,
  font: string,
  context: CanvasRenderingContext2D
) => {
  context!.font = `${size}px ${font}`;
  return Math.ceil(context!.measureText(text).width);
};

export const drawMeshElements = (
  ctx: CanvasRenderingContext2D
): IMeshDrawingTools => {
  return {
    drawHorizontalLine(width: number, y: number) {
      drawLine({
        ctx,
        opacity: MESH_LINES_OPACITY,
        color: chart.mesh.color,
        dashSegments: chart.mesh.dash,
        lineWidth: chart.mesh.strokeWidth,
        width,
        x: 0,
        y
      });
    },

    drawMid(x: number, height: number) {
      drawVerticalLine({
        ctx,
        opacity: MESH_LINES_OPACITY,
        color: chart.mesh.color,
        lineWidth: chart.mesh.strokeWidth,
        height,
        x,
        y: 0
      });
    },

    drawVerticalLine(x: number, height: number) {
      drawVerticalLine({
        ctx,
        opacity: MESH_LINES_OPACITY,
        color: chart.mesh.color,
        dashSegments: chart.mesh.dots,
        lineWidth: chart.mesh.strokeWidth,
        height,
        x,
        y: 0
      });
    },

    drawLabel(text: string, x: number, y: number, font: string) {
      drawText({
        ctx,
        color: chart.mesh.color,
        text,
        x,
        y,
        font
      });
    }
  };
};

export const drawChartElements = (
  ctx: CanvasRenderingContext2D,
  getArea: () => DepthArea
): IChartDrawingTools => {
  return {
    drawPointer(x: number, y: number) {
      const color =
        getArea() === DepthArea.Bid
          ? chart.bids.lineColor
          : chart.asks.lineColor;
      drawCircle({
        ctx,
        radius: chart.pointer.circleRadius,
        x,
        y,
        color,
        lineWidth: 1,
        lineColor: chart.pointer.circleStrokeColor
      });
    },

    drawLevel(points: IPoint[], fillColor: string) {
      drawArea({
        ctx,
        points,
        lineWidth: chart.strokeWidth,
        fill: fillColor
      });
    },

    drawPointerLine(height: number, x: number, y: number) {
      const color =
        getArea() === DepthArea.Bid
          ? chart.bids.lineColor
          : chart.asks.lineColor;

      drawVerticalLine({
        ctx,
        opacity: POINTER_OPACITY,
        color,
        dashSegments: chart.pointer.dash,
        lineWidth: chart.strokeWidth,
        height,
        x,
        y
      });
    },

    drawPopup(points: IPoint[]) {
      drawArea({
        ctx,
        points,
        lineWidth: chart.modal.strokeWidth,
        fill: chart.modal.fillColor
      });
    },

    drawText(
      x: number,
      y: number,
      area: DepthArea,
      midX: number,
      midY: number,
      endXPoint: number
    ) {
      return (
        textWidth: number,
        text: number | string,
        color: string,
        fontSize: number,
        padding: number,
        textPadding: number = 0
      ) => {
        drawText({
          ctx,
          color,
          x: getTextXCoords(x, textWidth, endXPoint, area, midX) + textPadding,
          y: getTextYCoords(y, midY) - padding,
          font: `${chart.modal.label.fontStyle} ${fontSize}px ${
            chart.modal.label.fontFamily
          }`,
          text: `${text}`,
          align: POPUP_ALIGN
        });
      };
    }
  };
};

export const getPopupCoords = (
  x: number,
  y: number,
  textWidth: number,
  area: DepthArea,
  midX: number,
  midY: number
) => {
  return [
    {
      x,
      y
    },
    {
      x,
      y: getYCoords(y, midY)
    },
    {
      x: getXCoords(textWidth, x, area, midX),
      y: getYCoords(y, midY)
    },
    {
      x: getXCoords(textWidth, x, area, midX),
      y
    }
  ];
};

export const getYCoords = (y: number, midY: number) => {
  return y - POPUP_HEIGHT < midY ? y + POPUP_HEIGHT : y - POPUP_HEIGHT;
};

export const getXCoords = (
  textWidth: number,
  x: number,
  area: DepthArea,
  midX: number
) => {
  const upRightPoint = textWidth + x + POPUP_TEXT_PADDING * 2;
  const upLeftPoint = x - textWidth - POPUP_TEXT_PADDING * 2;

  if (area === DepthArea.Bid) {
    const isLessThanMidBid = x < midX / 2;
    return isLessThanMidBid ? upRightPoint : upLeftPoint;
  } else {
    const midAsk = (midX / 2) * 3; // calculate the middle of asks x-coords
    const isLessThanMidAsk = x > midAsk;
    return isLessThanMidAsk ? upLeftPoint : upRightPoint;
  }
};

export const getTextYCoords = (y: number, midY: number) => {
  return y - POPUP_HEIGHT < midY ? y + POPUP_HEIGHT : y;
};

export const getTextXCoords = (
  x: number,
  textWidth: number,
  endXPoint: number,
  area: DepthArea,
  midX: number
) => {
  const startLeftPoint = x + POPUP_TEXT_PADDING;
  const startRightPoint = x - endXPoint - POPUP_TEXT_PADDING;

  if (area === DepthArea.Bid) {
    const isLessThanMidBid = x < midX / 2;
    return isLessThanMidBid ? startLeftPoint : startRightPoint;
  } else {
    const midAsk = (midX / 2) * 3; // calculate the middle of asks x-coords
    const isLessThanMidAsk = x > midAsk;
    return isLessThanMidAsk ? startRightPoint : startLeftPoint;
  }
};

export const getCurrentArea = (x: number, midXBids: number) =>
  x > midXBids ? DepthArea.Ask : DepthArea.Bid;

export const getDepthText = (area: DepthArea) =>
  area === DepthArea.Bid ? DepthText.CanBeSold : DepthText.CanBeBought;

export const generatePoints = (
  midX: number,
  height: number,
  orders: Order[],
  area: DepthArea,
  calculateStepLength: (index: number) => number,
  calculateStepHeight: (depth: number) => number
) => {
  let currentX = midX;
  let newX = midX;
  let newY = height;
  const points = [{x: midX, y: height}];

  for (let index = 0; index < orders.length; index++) {
    newX =
      area === DepthArea.Bid
        ? midX - calculateStepLength(index)
        : midX + calculateStepLength(index);

    newY = height - calculateStepHeight(orders[index].depth);
    points.push({x: currentX, y: newY}, {x: newX, y: newY});
    currentX = newX;
  }
  return points;
};

export const updatePointsForDrawing = (
  points: IPoint[],
  color: string,
  additionalPoints: IPoint[]
) => {
  const updatedPoints = points.map((point: IPoint) => ({
    ...point,
    color
  }));

  return [...updatedPoints, ...additionalPoints];
};
