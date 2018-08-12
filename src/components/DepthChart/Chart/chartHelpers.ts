import {
  drawArea,
  drawCircle,
  drawText,
  drawVerticalLine
} from '../../../utils/canvasUtils';
import chart from './chartConstants';

import {DepthArea} from '../../../models';
import {colors} from '../../styled';

export const getAreaColor = (area: DepthArea) =>
  area === DepthArea.Bid ? colors.buy : colors.sell;

export interface IDrawTools {
  drawPointer: (x: number, y: number) => void;
  drawLevel: (points: Array<{x: number; y: number; color?: string}>) => void;
  drawPointerLine: (height: number, x: number, y: number) => void;
  drawPopup: (points: Array<{x: number; y: number; color?: string}>) => void;
  drawText: (
    x: number,
    y: number,
    area: DepthArea,
    midX: number,
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

export const COST_PADDING = 15;
export const DEPTH_PADDING = 35;
export const PRICE_PADDING = 55;
export const PRICE_FONT_SIZE = 14;
export const FONT_SIZE = 13;
export const VALUE_PADDING = 3;
const POPUP_HEIGHT = 80;
const POPUP_TEXT_LEFT_PADDING = 10;
const POPUP_TEXT_RIGHT_PADDING = 10;

const context = document.createElement('canvas').getContext('2d');

export const measureText = (text: string, size: number, font: string) => {
  context!.font = `${size}px ${font}`;
  return Math.ceil(context!.measureText(text).width);
};

export const drawChartElements = (
  ctx: CanvasRenderingContext2D,
  getArea: () => DepthArea
): IDrawTools => {
  return {
    drawPointer(x: number, y: number) {
      drawCircle({
        ctx,
        radius: chart.pointer.circleRadius,
        x,
        y,
        color:
          getArea() === DepthArea.Bid
            ? chart.bids.lineColor
            : chart.asks.lineColor,
        lineWidth: 1,
        lineColor: chart.pointer.circleStrokeColor
      });
    },

    drawLevel(points: Array<{x: number; y: number; color?: string}>) {
      drawArea({
        ctx,
        points,
        lineWidth: chart.strokeWidth,
        fill: chart.bids.fillColor
      });
    },

    drawPointerLine(height: number, x: number, y: number) {
      drawVerticalLine({
        ctx,
        opacity: 0.6,
        color:
          getArea() === DepthArea.Bid
            ? chart.bids.lineColor
            : chart.asks.lineColor,
        dashSegments: chart.pointer.dash,
        lineWidth: chart.strokeWidth,
        height,
        x,
        y
      });
    },

    drawPopup(points: Array<{x: number; y: number; color?: string}>) {
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
      endXPoint: number
    ) {
      return (
        textWidth: number,
        text: number | string,
        color: string,
        fontSize: number,
        padding: number,
        labelWidth: number = 0
      ) => {
        drawText({
          ctx,
          color,
          x: getTextXCoords(x, textWidth, endXPoint, area, midX) + labelWidth,
          y: getTextYCoords(y) - padding,
          font: `${fontSize}px sans-serif`,
          text: `${text}`,
          align: 'left'
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
  midX: number
) => {
  return [
    {
      x,
      y
    },
    {
      x,
      y: getYCoords(y)
    },
    {
      x: getXCoords(textWidth, x, area, midX),
      y: getYCoords(y)
    },
    {
      x: getXCoords(textWidth, x, area, midX),
      y
    }
  ];
};

export const getYCoords = (y: number) => {
  return y - POPUP_HEIGHT < 0 ? y + POPUP_HEIGHT : y - POPUP_HEIGHT;
};

export const getXCoords = (
  textWidth: number,
  x: number,
  area: DepthArea,
  midX: number
) => {
  if (area === DepthArea.Bid) {
    const isLessThanMidBid = x < midX / 2;
    if (isLessThanMidBid) {
      return textWidth + x + POPUP_TEXT_LEFT_PADDING + POPUP_TEXT_RIGHT_PADDING;
    }
    return x - textWidth - POPUP_TEXT_LEFT_PADDING;
  } else {
    const isLessThanMidAsk = x > midX / 2 * 3;
    if (isLessThanMidAsk) {
      return x - textWidth - POPUP_TEXT_LEFT_PADDING;
    }
    return textWidth + x + POPUP_TEXT_LEFT_PADDING + POPUP_TEXT_RIGHT_PADDING;
  }
};

export const getTextYCoords = (y: number) => {
  return y - POPUP_HEIGHT < 0 ? y + POPUP_HEIGHT : y;
};

export const getTextXCoords = (
  x: number,
  textWidth: number,
  endXPoint: number,
  area: DepthArea,
  midX: number
) => {
  if (area === DepthArea.Bid) {
    const isLessThanMidBid = x < midX / 2;
    if (isLessThanMidBid) {
      return x + POPUP_TEXT_LEFT_PADDING;
    }
    return x - endXPoint;
  } else {
    const isLessThanMidAsk = x > midX / 2 * 3;
    if (isLessThanMidAsk) {
      return x - endXPoint;
    }
    return x + POPUP_TEXT_LEFT_PADDING;
  }
};
