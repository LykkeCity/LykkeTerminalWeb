import {
  drawArea,
  drawCircle,
  drawText,
  drawVerticalLine
} from '../../../utils/canvasUtils';
import chart from './chartConstants';

import {Area} from './Chart';

import {colors} from '../../styled';

const getAreaColor = (area: Area) =>
  area === Area.Bid ? colors.buy : colors.sell;

export interface IDrawTools {
  drawPointer: (x: number, y: number) => void;
  drawLevel: (points: Array<{x: number; y: number; color?: string}>) => void;
  drawPointerLine: (height: number, x: number, y: number) => void;
  drawPopup: (points: Array<{x: number; y: number; color?: string}>) => void;
  drawPrice: (
    x: number,
    y: number,
    area: Area,
    priceWidth: number,
    price: number,
    midX: number,
    endXPoint: number
  ) => void;
  drawDepthLabel: (
    x: number,
    y: number,
    depthWidth: number,
    area: Area,
    endXPoint: number,
    depthLabel: string,
    midX: number
  ) => void;
  drawCostLabel: (
    x: number,
    y: number,
    depthWidth: number,
    area: Area,
    endXPoint: number,
    depthLabel: string,
    midX: number
  ) => void;
  drawDepthValue: (
    depthLabelWidth: number,
    endXPoint: number,
    depthValueWidth: number,
    depthValue: number,
    area: Area,
    y: number,
    x: number,
    midX: number
  ) => void;
  drawCostValue: (
    costLabelWidth: number,
    endXPoint: number,
    costValueWidth: number,
    costValue: number,
    area: Area,
    y: number,
    x: number,
    midX: number
  ) => void;
}

const POPUP_HEIGHT = 80;
const POPUP_TEXT_PADDING = 10;
const EXACT_PRICE_PADDING = 15;
const DEPTH_PADDING = 35;
const PRICE_PADDING = 55;
const PRICE_FONT_SIZE = 14;
const FONT_SIZE = 13;

const ctx = document.createElement('canvas').getContext('2d');

export const measureText = (text: string, size: number, font: string) => {
  ctx!.font = `${size}px ${font}`;
  return Math.ceil(ctx!.measureText(text).width);
};

export const drawChartElements = (
  context: CanvasRenderingContext2D,
  getArea: () => Area
): IDrawTools => {
  return {
    drawPointer(x: number, y: number) {
      drawCircle({
        ctx: context,
        radius: chart.pointer.circleRadius,
        x,
        y,
        color:
          getArea() === Area.Bid ? chart.bids.lineColor : chart.asks.lineColor,
        lineWidth: 1,
        lineColor: chart.pointer.circleStrokeColor
      });
    },

    drawLevel(points: Array<{x: number; y: number; color?: string}>) {
      drawArea({
        ctx: context,
        points,
        lineWidth: chart.strokeWidth,
        fill: chart.bids.fillColor
      });
    },

    drawPointerLine(height: number, x: number, y: number) {
      drawVerticalLine({
        ctx: context,
        opacity: 0.6,
        color:
          getArea() === Area.Bid ? chart.bids.lineColor : chart.asks.lineColor,
        dashSegments: chart.pointer.dash,
        lineWidth: chart.strokeWidth,
        height,
        x,
        y
      });
    },

    drawPopup(points: Array<{x: number; y: number; color?: string}>) {
      drawArea({
        ctx: context,
        points,
        lineWidth: chart.modal.strokeWidth,
        fill: chart.modal.fillColor
      });
    },

    drawPrice(
      x: number,
      y: number,
      area: Area,
      priceWidth: number,
      price: number,
      midX: number,
      endXPoint: number
    ) {
      drawText({
        ctx: context,
        color: colors.white,
        x: getTextXCoords(priceWidth, x, midX, area, endXPoint),
        y: getTextYCoords(y) - PRICE_PADDING,
        font: `${PRICE_FONT_SIZE}px sans-serif`,
        text: `${price}`,
        align: 'left'
      });
    },

    drawDepthLabel(
      x: number,
      y: number,
      depthWidth: number,
      area: Area,
      endXPoint: number,
      depthLabel: string,
      midX: number
    ) {
      drawLabel(
        context,
        area,
        depthWidth,
        x,
        y,
        midX,
        endXPoint,
        DEPTH_PADDING,
        depthLabel
      );
    },

    drawCostLabel(
      x: number,
      y: number,
      costWidth: number,
      area: Area,
      endXPoint: number,
      costLabel: string,
      midX: number
    ) {
      drawLabel(
        context,
        area,
        costWidth,
        x,
        y,
        midX,
        endXPoint,
        EXACT_PRICE_PADDING,
        costLabel
      );
    },

    drawDepthValue(
      depthLabelWidth: number,
      endXPoint: number,
      depthValueWidth: number,
      depthValue: number,
      area: Area,
      y: number,
      x: number,
      midX: number
    ) {
      drawText({
        ctx: context,
        color: colors.white,
        x:
          getTextXCoords(depthValueWidth, x, midX, area, endXPoint) +
          depthLabelWidth,
        y: getTextYCoords(y) - DEPTH_PADDING,
        font: `${FONT_SIZE}px sans-serif`,
        text: `${depthValue}`,
        align: 'left'
      });
    },

    drawCostValue(
      costLabelWidth: number,
      endXPoint: number,
      costValueWidth: number,
      costValue: number,
      area: Area,
      y: number,
      x: number,
      midX: number
    ) {
      drawText({
        ctx: context,
        color: colors.white,
        x:
          getTextXCoords(costValueWidth, x, midX, area, endXPoint) +
          costLabelWidth,
        y: getTextYCoords(y) - DEPTH_PADDING,
        font: `${FONT_SIZE}px sans-serif`,
        text: `${costValue}`,
        align: 'left'
      });
    }
  };
};

const drawLabel = (
  context: CanvasRenderingContext2D,
  area: Area,
  textWidth: number,
  x: number,
  y: number,
  midX: number,
  endXPoint: number,
  padding: number,
  label: string
) => {
  drawText({
    ctx: context,
    color: getAreaColor(area),
    x: getTextXCoords(textWidth, x, midX, area, endXPoint),
    y: getTextYCoords(y) - padding,
    font: `${FONT_SIZE}px sans-serif`,
    text: label,
    align: 'left'
  });
};

export const getPopupCoords = (
  x: number,
  y: number,
  textWidth: number,
  area: Area,
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
  area: Area,
  midX: number
) => {
  if (area === Area.Bid) {
    const isLessThanMidBid = x < midX / 2;
    if (isLessThanMidBid) {
      return textWidth + x + POPUP_TEXT_PADDING;
    }
    return x - textWidth - POPUP_TEXT_PADDING;
  } else {
    const isLessThanMidAsk = x > midX / 2 * 3;
    if (isLessThanMidAsk) {
      return x - textWidth - POPUP_TEXT_PADDING;
    }
    return textWidth + x + POPUP_TEXT_PADDING;
  }
};

export const getTextYCoords = (y: number) => {
  return y - POPUP_HEIGHT < 0 ? y + POPUP_HEIGHT : y;
};

export const getTextXCoords = (
  x: number,
  textWidth: number,
  endXPoint: number,
  area: Area,
  midX: number
) => {
  if (area === Area.Bid) {
    const isLessThanMidBid = x < midX / 2;
    if (isLessThanMidBid) {
      return x + POPUP_TEXT_PADDING;
    }
    return x - endXPoint;
  } else {
    const isLessThanMidAsk = x > midX / 2 * 3;
    if (isLessThanMidAsk) {
      return x - endXPoint;
    }
    return x + POPUP_TEXT_PADDING;
  }
};
