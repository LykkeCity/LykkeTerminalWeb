const chart = {
  mesh: {
    color: '#8c94a0',
    dash: [1, 3],
    strikeWidth: 1,
    opacity: 0.4,
    verticalFontSize: 14,
    horizontalFontSize: 12,
    fontFamily: 'Proxima Nova',

    verticalLinesAmount: 8,
    horizontalLinesAmount: 16
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
    longBeforeArrow: 300,
    shortBeforeArrow: 38,
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
      fontFamily: 'Proxima Nova',
      fontSize: 14,
      fontStyle: 'normal',
      fontColor: 'rgba(234, 237, 239, 0.4)'
    },
    number: {
      fontFamily: 'Proxima Nova',
      fontSize: 16,
      fontStyle: 'bold',
      fontColor: '#ffffff'
    },
    marginLeft: 16
  },

  strokeWidth: 2,
  fillOpacity: 0.2,

  width: 1125,
  height: 549,

  labelsWidth: 50,
  labelsHeight: 45
};

export default chart;
