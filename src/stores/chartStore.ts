import {ISubscription} from 'autobahn';
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

  renderChart = async () => {
    await this.unsubscribeFromCandle();
    this.shouldHandleOutsideClick = false;

    const instrument = this.rootStore.uiStore.selectedInstrument;
    const chartContainerExists = document.getElementById('tv_chart_container');
    if (!chartContainerExists || !(window as any).TradingView || !instrument) {
      return;
    }

    chartContainerExists.style.display = 'none';

    this.settings = this.updateSettings(defaultSettings);
    if (this.rootStore.authStore.isAuth) {
      try {
        await this.loadAndSetCustomChartData();
      } catch (error) {
        if (error.status === 404) {
          this.settings = this.updateSettings(defaultSettings);
        }
        if (error.status === 401) {
          await this.loadAndSetCustomChartData();
        }
      }
    }

    this.createWidget(instrument);

    this.widget.onChartReady(() => {
      this.bindClickOutside();

      if (this.rootStore.authStore.isAuth) {
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

  loadAndSetCustomChartData = () => {
    return this.api.load().then((res: any) => {
      this.settings = this.updateSettings(JSON.parse(res.Data));
    });
  };

  resetToDefault = () => {
    if (this.widget) {
      this.widget.load(this.updateSettings(defaultSettings));
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

  private createWidget = (instrument: InstrumentModel) => {
    const rightOffset =
      this.settings.charts[0].timeScale.m_rightOffset < 0
        ? this.settings.charts[0].timeScale.m_rightOffset
        : 0;
    const barSpacing = this.settings.charts[0].timeScale.m_barSpacing;

    this.widget = new (window as any).TradingView.widget({
      customFormatters: {
        // timeFormatter: {
        //   format: (date: any) => date.toLocaleTimeString()
        // },
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
        this.getWs(),
        this.subscribeToCandlesWithResolutions
      ),
      toolbar_bg: '#333',
      library_path: 'charting_library/',
      enabled_features: [
        'hide_last_na_study_output',
        'left_toolbar',
        'keep_left_toolbar_visible_on_small_screens'
      ],
      disabled_features: [
        'widget_logo',
        'link_to_tradingview',
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
        'timeScale.barSpacing': barSpacing
      },
      custom_css_url: process.env.PUBLIC_URL + '/chart_custom.css',
      saved_data: this.settings,
      auto_save_delay: 2,
      timezone
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
