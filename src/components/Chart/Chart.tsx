import * as React from 'react';
// import {UDFCompatibleDatafeed} from './udf';

const LINESTYLE_DASHED = 2;

// tslint:disable:object-literal-sort-keys
class Chart extends React.Component {
  componentDidMount() {
    const tv: any = (window as any).TradingView;

    if (tv && tv.onready) {
      // tslint:disable-next-line:no-unused-expression
      new tv.widget({
        width: 870,
        height: 400,
        symbol: 'NASDAQ:AAPL',
        interval: 'D',
        timezone: 'exchange',
        theme: 'Dark',
        style: 1,
        hide_top_toolbar: true,
        save_image: false,
        hideideas: true,
        container_id: 'tv_chart_container',
        overrides: {
          overrides: {
            'paneProperties.background': '#333',
            'paneProperties.vertGridProperties.color':
              'rgba(140, 148, 160, 0.6)',
            'paneProperties.vertGridProperties.style': LINESTYLE_DASHED,
            'paneProperties.horzGridProperties.color': 'rgba(255, 0, 0, 0.6)',
            'paneProperties.horzGridProperties.style': LINESTYLE_DASHED,
            'paneProperties.crossHairProperties.color':
              'rgba(140, 148, 160, 0.6)',
            'paneProperties.crossHairProperties.width': 1,
            'paneProperties.crossHairProperties.style': LINESTYLE_DASHED,
            volumePaneSize: 'tiny',
            'mainSeriesProperties.style': 1,

            'mainSeriesProperties.showCountdown': true,
            'mainSeriesProperties.visible': true,
            'mainSeriesProperties.showPriceLine': true,
            'mainSeriesProperties.priceLineWidth': 1,
            'mainSeriesProperties.lockScale': false,
            'mainSeriesProperties.minTick': 'default',

            'mainSeriesProperties.priceAxisProperties.autoScale': true,
            'mainSeriesProperties.priceAxisProperties.autoScaleDisabled': false,
            'mainSeriesProperties.priceAxisProperties.percentage': false,
            'mainSeriesProperties.priceAxisProperties.percentageDisabled': false,
            'mainSeriesProperties.priceAxisProperties.log': false,
            'mainSeriesProperties.priceAxisProperties.logDisabled': false,

            'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0)',

            'mainSeriesProperties.candleStyle.upColor': '#13b72a',
            'mainSeriesProperties.candleStyle.downColor': '#ff3e2e',
            'mainSeriesProperties.candleStyle.drawWick': true,
            'mainSeriesProperties.candleStyle.drawBorder': false,
            'mainSeriesProperties.candleStyle.wickUpColor':
              'rgba(140, 148, 160, 0.4)',
            'mainSeriesProperties.candleStyle.wickDownColor':
              'rgba(140, 148, 160, 0.4)',
            'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false
          }
        },
        custom_css_url:
          'http://localhost:5000/charting_library/static/style.css'
      });
    }
  }

  render() {
    return <div id="tv_chart_container">&nbsp;</div>;
  }
}

export default Chart;
