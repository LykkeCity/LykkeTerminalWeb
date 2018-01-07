import {ChartApi} from './api/index';

// tslint:disable:object-literal-sort-keys

const config = {
  exchanges: [],
  supported_resolutions: [
    '1',
    '5',
    '15',
    '30',
    '60',
    '240',
    '360',
    '720',
    '1D',
    '1W',
    '1M'
  ]
};

export default (session: any) => {
  const w = window as any;
  const widget = new w.TradingView.widget({
    // fullscreen: true,
    autosize: true,
    symbol: 'BTCUSD',
    interval: '1',
    container_id: 'tv_chart_container',
    datafeed: new ChartApi(session, config),
    library_path: 'charting_library/',
    locale: w.getParameterByName('lang') || 'en',
    // 	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
    // drawings_access: {type: 'black', tools: [{name: 'Regression Trend'}]},
    disabled_features: ['use_localstorage_for_settings'],
    // toolbar_bg: '#333333',
    preset: 'mobile',
    overrides: {
      'paneProperties.background': '#333333',
      'paneProperties.vertGridProperties.color': 'rgba(140, 148, 160, 0.6)',
      'paneProperties.horzGridProperties.color': 'rgba(140, 148, 160, 0.6)',
      'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0)',
      'scalesProperties.textColor': '#AAA',
      'mainSeriesProperties.candleStyle.drawBorder': true
    },
    custom_css_url: process.env.PUBLIC_URL + '/chart.css'
  });
  return widget;
};
