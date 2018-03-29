const chart = {
  mesh: {
    color: '#8c94a0',
    dash: [1, 3],
    strikeWidth: 2,
    opacity: 0.6,
    verticalFontSize: 14,
    horizontalFontSize: 12,
    fontFamily: 'Proxima Nova',

    verticalLinesAmount: 8,
    horizontalLinesAmount: 20
  },
  asks: {
    lineColor: '#ffae2c',
    fillColor: 'rgba(255, 174, 44, 0.15)',
    fillStrokeColor: 'rgba(255, 174, 44, 0.001)'
  },
  bids: {
    lineColor: '#ab00ff',
    fillColor: 'rgba(171, 0, 255, 0.2)',
    fillStrokeColor: 'rgba(171, 0, 255, 0.001)'
  },
  pointer: {
    dash: [3, 3]
  },

  strokeWidth: 2,
  fillOpacity: 0.2
};

export default chart;
