// tslint:disable:object-literal-sort-keys
// tslint:disable:no-console
export default () => {
  const w = window as any;
  const widget = new w.TradingView.widget({
    // fullscreen: true,
    autosize: true,
    symbol: 'AAPL',
    interval: 'D',
    container_id: 'tv_chart_container',
    // 	BEWARE: no trailing slash is expected in feed URL
    datafeed: new w.Datafeeds.UDFCompatibleDatafeed(
      'https://demo_feed.tradingview.com'
    ),
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
      'scalesProperties.textColor': '#AAA'
    }
  });
  console.info(widget);
};
