import {ISubscription} from 'autobahn';
import {ChartApi, ChartDataFeed, PriceApi} from '../api';
import {CHART_DEFAULT_SETTINGS} from '../constants/chartDefaultSettings';
import {timeZones} from '../constants/chartTimezones';
import {InstrumentModel} from '../models/index';
import {dateFns} from '../utils/index';
import {BaseStore, RootStore} from './index';

export const LINESTYLE_DOTTED = 1;
export const LINESTYLE_DASHED = 2;
export const LINESTYLE_SOLID = 0;
export const LINESTYLE_LARGE_DASHED = 3;

const timezone = dateFns.getTimeZone(timeZones);
const defaultSettings = CHART_DEFAULT_SETTINGS;
defaultSettings.charts[0].timezone = timezone;

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

  private widget: any;
  private shouldHandleOutsideClick = false;
  private subscriptions: Set<ISubscription> = new Set();

  constructor(store: RootStore, private readonly api: ChartApi) {
    super(store);
  }

  bindClickOutside = () => {
    this.shouldHandleOutsideClick = true;
    document.addEventListener('click', () => {
      const chartContainerExists = document.getElementById(
        'tv_chart_container'
      );
      if (this.shouldHandleOutsideClick && chartContainerExists) {
        const chartExists = document.getElementsByTagName('iframe')[0];
        if (chartExists) {
          this.widget.closePopupsAndDialogs();
        }
      }
    });
  };

  renderChart = async (instrument: InstrumentModel) => {
    await this.unsubscribeFromCandle();
    this.shouldHandleOutsideClick = false;
    const chartContainerExists = document.getElementById('tv_chart_container');
    if (!chartContainerExists || !(window as any).TradingView) {
      return;
    }
    this.widget = new (window as any).TradingView.widget({
      customFormatters: {
        timeFormatter: {
          format: (date: any) => date.toLocaleTimeString()
        },
        dateFormatter: {
          format: (date: any) => date.toLocaleDateString()
        }
      },
      autosize: true,
      symbol: instrument.displayName,
      interval: '60',
      container_id: 'tv_chart_container',
      datafeed: new ChartDataFeed(
        ChartStore.config,
        instrument,
        new PriceApi(this),
        this.getWs(),
        this.subscribeToCandlesWithResolutions
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
        'show_interval_dialog_on_keypress',
        'timeframes_toolbar',
        'use_localstorage_for_settings',
        'save_chart_properties_to_local_storage'
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
        'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,

        'timeScale.rightOffset': 0,
        timezone
      },
      custom_css_url: process.env.PUBLIC_URL + '/chart.css'
    });
    chartContainerExists.style.display = 'none';
    if (this.rootStore.authStore.isAuth) {
      this.widget.onChartReady(() => {
        this.bindClickOutside();
        this.load()
          .then((res: any) => {
            if (res && res.Data) {
              const settings = JSON.parse(res.Data);
              settings.charts[0].timezone = timezone;

              this.widget.load(settings);
            }
            chartContainerExists.style.display = 'block';
          })
          .catch(err => {
            if (err.status === 404) {
              this.widget.load(defaultSettings);
            }
            chartContainerExists.style.display = 'block';
          });
        this.widget.subscribe('onAutoSaveNeeded', () => {
          this.widget.save(this.save);
        });
      });
    } else {
      this.widget.onChartReady(() => {
        this.bindClickOutside();
        this.widget.load(CHART_DEFAULT_SETTINGS);

        chartContainerExists.style.display = 'block';
      });
    }
  };

  save = (settings: any) => {
    this.api.save({Data: JSON.stringify(settings)});
  };

  load = () => this.api.load();

  resetToDefault = () => {
    if (this.widget) {
      this.widget.load(defaultSettings);
    }
  };

  subscribeToCandlesWithResolutions = (s: ISubscription) =>
    this.subscriptions.add(s);

  unsubscribeFromCandle = async () => {
    const subscriptions = Array.from(this.subscriptions).map(s => {
      // tslint:disable-next-line:no-unused-expression
      this.getWs() && this.getWs().unsubscribe(s);
    });
    await Promise.all(subscriptions);
    if (this.subscriptions.size > 0) {
      this.subscriptions.clear();
    }
  };

  reset = () => {
    this.unsubscribeFromCandle();
  };
}

export default ChartStore;
