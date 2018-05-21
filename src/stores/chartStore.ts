import {pathOr} from 'rambda';
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
  private settings: any;
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

  renderChart = async () => {
    this.shouldHandleOutsideClick = false;

    const instrument = this.rootStore.uiStore.selectedInstrument;
    const chartContainerExists = document.getElementById('tv_chart_container');
    if (!chartContainerExists || !(window as any).TradingView || !instrument) {
      return;
    }

    chartContainerExists.style.display = 'none';

    this.settings = this.updateSettings(defaultSettings);
    if (this.isAuth) {
      await this.load()
        .then((res: any) => {
          this.settings = this.updateSettings(JSON.parse(res.Data));
        })
        .catch(err => {
          if (err.status === 404) {
            this.settings = this.updateSettings(defaultSettings);
          }
        });
    }

    this.createWidget(instrument);

    this.widget.onChartReady(() => {
      this.bindClickOutside();

      if (this.isAuth) {
        this.widget.subscribe('onAutoSaveNeeded', () => {
          setTimeout(() => this.widget.save(this.save), 1000);
        });

        this.widget.subscribe('onIntervalChange', () => {
          setTimeout(() => this.widget.save(this.save), 1000);
        });

        setTimeout(
          () =>
            this.widget
              .chart()
              .setVisibleRange(this.settings.charts[0].visibleRange),
          1000
        );
      }

      chartContainerExists.style.display = 'block';
    });
  };

  save = (settings: any) => {
    settings.charts[0].visibleRange = this.widget.chart().getVisibleRange();
    this.api.save({Data: JSON.stringify(settings)});
  };

  load = () => this.api.load();

  resetToDefault = () => {
    if (this.widget) {
      this.widget.load(this.updateSettings(defaultSettings));
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
      symbol: instrument!.displayName,
      interval: '60',
      container_id: 'tv_chart_container',
      datafeed: new ChartDataFeed(
        ChartStore.config,
        instrument!,
        new PriceApi(this),
        this.getWs()
      ),
      toolbar_bg: '#333',
      library_path: 'charting_library/',
      enabled_features: ['hide_last_na_study_output'],
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
        timezone
      },
      custom_css_url: process.env.PUBLIC_URL + '/chart.css',
      saved_data: this.updateSettings(this.settings)
    });
  };

  private updateSettings = (settings: any) => {
    const instrument = this.rootStore.uiStore.selectedInstrument;

    settings.charts[0].timezone = timezone;
    settings.charts[0].panes[0].sources[1].state.precision = pathOr(
      0,
      ['accuracy'],
      instrument!.baseAsset
    );

    return settings;
  };
}

export default ChartStore;
