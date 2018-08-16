const chart = {
  mesh: {
    color: '#8c94a0',
    dash: [2, 5],
    dots: [1, 5],
    strokeWidth: 1,
    opacity: 0.4,
    verticalFontSize: 12,
    horizontalFontSize: 12,
    fontFamily: 'Proxima Nova',

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

  strokeWidth: 1,
  fillOpacity: 0.2,

  labelsWidth: 50,
  labelsHeight: 25,

  labelsAccuracy: 2,

  scaleFactor: 0.9
};

export default chart;
