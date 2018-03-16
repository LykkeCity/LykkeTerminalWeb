import {ChartApi, ChartDataFeed, PriceApi} from '../api';
import {InstrumentModel} from '../models/index';
import {BaseStore, RootStore} from './index';

// tslint:disable:object-literal-sort-keys

export const LINESTYLE_DOTTED = 1;
export const LINESTYLE_DASHED = 2;
export const LINESTYLE_SOLID = 0;
export const LINESTYLE_LARGE_DASHED = 3;

class ChartStore extends BaseStore {
  static readonly config = {
    supports_search: false,
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
    ],
    supports_time: true
  };

  constructor(store: RootStore, private readonly api: ChartApi) {
    super(store);
  }

  renderChart = (instrument: InstrumentModel) => {
    const chartContainerExists = document.getElementById('tv_chart_container');
    if (!chartContainerExists || !(window as any).TradingView) {
      return;
    }
    const widget = new (window as any).TradingView.widget({
      autosize: true,
      symbol: instrument.name,
      interval: '60',
      container_id: 'tv_chart_container',
      datafeed: new ChartDataFeed(
        ChartStore.config,
        instrument,
        new PriceApi(this),
        this.getWs()
      ),
      toolbar_bg: '#333',
      library_path: 'charting_library/',
      disabled_features: [
        'widget_logo',
        'link_to_tradingview',
        'left_toolbar',
        'header_symbol_search',
        'header_screenshot',
        'compare_symbol',
        'header_compare',
        'display_market_status',
        'border_around_the_chart',
        'remove_library_container_border',
        'header_undo_redo',
        'header_interval_dialog_button',
        'show_interval_dialog_on_keypress'
      ],
      overrides: {
        'paneProperties.background': '#333333',
        'paneProperties.vertGridProperties.color': 'rgba(140, 148, 160, 0.6)',
        'paneProperties.vertGridProperties.style': LINESTYLE_DOTTED,
        'paneProperties.horzGridProperties.color': 'rgba(140, 148, 160, 0.6)',
        'paneProperties.horzGridProperties.style': LINESTYLE_DASHED,
        'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0)',

        'scalesProperties.textColor': 'rgb(140, 148, 160)',

        'mainSeriesProperties.candleStyle.upColor': 'rgb(19, 183, 42)',
        'mainSeriesProperties.candleStyle.downColor': 'rgb(255, 62, 46)',
        'mainSeriesProperties.candleStyle.drawWick': true,
        'mainSeriesProperties.candleStyle.drawBorder': true,
        'mainSeriesProperties.candleStyle.wickUpColor':
          'rgba(140, 148, 160, 0.4)',
        'mainSeriesProperties.candleStyle.wickDownColor':
          'rgba(140, 148, 160, 0.4)',
        'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false
      },
      custom_css_url: process.env.PUBLIC_URL + '/chart.css'
    });
    if (this.rootStore.authStore.isAuth) {
      chartContainerExists.style.display = 'none';
      widget.onChartReady(() => {
        this.load()
          .then((res: any) => {
            if (res && res.Data) {
              const settings = JSON.parse(res.Data);
              widget.load(settings);
            }
            chartContainerExists.style.display = 'block';
          })
          .catch(() => {
            chartContainerExists.style.display = 'block';
          });
        widget.subscribe('onAutoSaveNeeded', () => {
          widget.save(this.save);
        });
      });
    }
  };

  save = (settings: any) => {
    this.api.save({Data: JSON.stringify(settings)});
  };

  load = () => this.api.load();

  reset = () => {
    return;
  };
}

export default ChartStore;
