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
  private settings: any = defaultSettings;
  private shouldHandleOutsideClick = false;

  private isAuth: boolean = this.rootStore.authStore.isAuth;

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
    this.shouldHandleOutsideClick = false;
    this.settings = defaultSettings;

    const chartContainerExists = document.getElementById('tv_chart_container');
    if (!chartContainerExists || !(window as any).TradingView) {
      return;
    }

    chartContainerExists.style.display = 'none';

    this.settings = defaultSettings;
    if (this.isAuth) {
      await this.load()
        .then((res: any) => {
          this.settings = JSON.parse(res.Data);
          this.settings.charts[0].timezone = timezone;
        })
        .catch(err => {
          if (err.status === 404) {
            this.settings = defaultSettings;
          }
        });
    }

    this.createWidget(instrument);

    this.widget.onChartReady(() => {
      this.bindClickOutside();

      if (this.isAuth) {
        this.widget.subscribe('onAutoSaveNeeded', () =>
          this.widget.save(this.save)
        );

        this.widget.subscribe('onIntervalChange', () => {
          setTimeout(() => this.widget.save(this.save), 100);
        });
      }

      chartContainerExists.style.display = 'block';
    });
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

  reset = () => {
    return;
  };

  private createWidget = (instrument: InstrumentModel) => {
    const rightOffset =
      this.settings.charts[0].timeScale.m_rightOffset < 0
        ? this.settings.charts[0].timeScale.m_rightOffset
        : 0;
    const barSpacing = this.settings.charts[0].timeScale.m_barSpacing;

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

        'timeScale.rightOffset': rightOffset,
        'timeScale.barSpacing': barSpacing,
        timezone
      },
      custom_css_url: process.env.PUBLIC_URL + '/chart.css',
      saved_data: this.settings,
      auto_save_delay: 2
    });
  };
}

export default ChartStore;
