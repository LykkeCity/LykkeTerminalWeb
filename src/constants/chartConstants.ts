export const COST_PADDING = 15;
export const DEPTH_PADDING = 35;
export const PRICE_PADDING = 55;
export const PRICE_FONT_SIZE = 14;
export const FONT_SIZE = 13;
export const VALUE_PADDING = 3;
export const POPUP_HEIGHT = 80;
export const POPUP_TEXT_PADDING = 10;
export const MESH_LINES_OPACITY = 0.6;
export const POINTER_OPACITY = 0.6;
export const POPUP_ALIGN = 'left';

const chart = {
  mesh: {
    color: '#8c94a0',
    dash: [2, 5],
    dots: [1, 5],
    strokeWidth: 1,
    opacity: 0.4,
    verticalFontSize: 12,
    horizontalFontSize: 12,
    fontFamily: 'Lekton, monospace',

    verticalLinesAmount: 8,
    horizontalLinesAmount: 10
  },
  asks: {
    lineColor: '#ff6161',
    fillColor: 'rgba(255, 97, 97, 0.15)',
    fillStrokeColor: 'rgba(171, 0, 255, 0.001)'
  },
  bids: {
    lineColor: '#46eb6a',
    fillColor: 'rgba(70, 235, 106, 0.15)',
    fillStrokeColor: 'rgba(255, 174, 44, 0.001)'
  },
  pointer: {
    dash: [3, 3],
    circleRadius: 4,
    circleStrokeColor: '#333333'
  },
  modal: {
    width: 350,
    longBeforeArrow: 320,
    shortBeforeArrow: 18,
    height: 112.4,
    shiftFromBall: 10,
    arrowWidth: 12,
    arrowHeight: 10,
    fillColor: '#3c3c3c',
    strokeColor: 'rgba(0, 0, 0, 0.2)',
    strokeWidth: 1,

    title: {
      fontFamily: 'Akrobat',
      fontSize: 24,
      fontStyle: 'bold',
      fontColor: '#f5f6f7'
    },
    label: {
      fontFamily: 'Lekton, monospace',
      fontSize: 14,
      fontStyle: 'bold',
      fontColor: 'rgba(234, 237, 239, 0.4)'
    },
    number: {
      fontFamily: 'Lekton, monospace',
      fontSize: 16,
      fontStyle: 'bold',
      fontColor: '#ffffff'
    },
    marginLeft: 16
  },

  strokeWidth: 1,
  fillOpacity: 0.2,

  labelsWidth: 50,
  labelsHeight: 25,

  labelsAccuracy: 2,

  scaleFactor: 0.9
};

export default chart;
