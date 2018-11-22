import * as React from 'react';
import {
  ChartingLibraryWidgetOptions,
  IBasicDataFeed,
  widget
} from '../../charting_library/charting_library.min';
import {
  overrides,
  studiesOverrides
} from '../../constants/chartDefaultSettings';
import {InstrumentModel, PriceType} from '../../models';
import {chartPalette} from '../styled';
import {
  ButtonWithImg,
  ChartContainer,
  ChartControlBar,
  ChartPlaceholder,
  ChartWrapper,
  loadPath,
  savePath,
  SvgButton,
  TransparentDiv
} from './styles';

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions['library_path'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  containerId: ChartingLibraryWidgetOptions['container_id'];
  instrument: InstrumentModel;
  isAuth: boolean;
  selectedPriceType: PriceType;
  getDatafeed: () => IBasicDataFeed;
  loadSettings: () => Promise<any>;
  saveSettings: (settings: any) => void;
  selectPriceType: (priceType: PriceType) => void;
  subscribeToCandle: () => void;
  unsubscribeFromCandle: () => void;
}

interface ChartStateProps {
  chartReady: boolean;
}

class Chart extends React.Component<
  Partial<ChartContainerProps>,
  ChartStateProps
> {
  static defaultProps: Partial<ChartContainerProps> = {
    interval: '1D',
    containerId: 'tv_chart_container',
    datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: 'charting_library/',
    fullscreen: false,
    autosize: true
  };

  private tvWidget: any;

  constructor(props: ChartContainerProps) {
    super(props);
    this.state = {
      chartReady: false
    };
  }

  componentDidUpdate(prevProps: any): void {
    if (
      !prevProps.instrument ||
      this.props.selectedPriceType !== prevProps.selectedPriceType
    ) {
      this.renderChart();
      return;
    }

    const prevInstrument = prevProps.instrument
      ? prevProps.instrument.name
      : null;
    const currentInstrument = this.props.instrument
      ? this.props.instrument.name
      : null;
    const areInstruments = prevInstrument || currentInstrument;

    if (
      this.state.chartReady &&
      areInstruments &&
      prevInstrument !== currentInstrument
    ) {
      this.tvWidget._options.datafeed.setInstrument(this.props.instrument);

      this.tvWidget.chart().setSymbol(this.props.instrument!.displayName);
    }
  }

  createWidget = () => {
    const {
      containerId,
      instrument,
      interval,
      libraryPath,
      fullscreen,
      autosize,
      getDatafeed
    } = this.props;
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: instrument!.displayName as string,
      datafeed: getDatafeed!(),
      interval: interval as ChartingLibraryWidgetOptions['interval'],
      container_id: containerId as ChartingLibraryWidgetOptions['container_id'],
      library_path: libraryPath as string,
      locale: 'en',
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
        'use_localstorage_for_settings',
        'save_chart_properties_to_local_storage',
        'go_to_date'
      ],
      enabled_features: [
        'hide_last_na_study_output',
        'left_toolbar',
        'keep_left_toolbar_visible_on_small_screens'
      ],
      time_frames: [
        {text: '5D', title: '5D', resolution: '5', description: '5 days'},
        {text: '1m', title: '1M', resolution: '30', description: '1 month'},
        {text: '3m', title: '3M', resolution: '60', description: '3 months'},
        {text: '6m', title: '6M', resolution: '1D', description: '6 months'}
      ],
      fullscreen,
      autosize,
      toolbar_bg: chartPalette.background,
      overrides,
      studies_overrides: studiesOverrides,
      custom_css_url: process.env.PUBLIC_URL + '/tv_custom.css'
    };

    this.tvWidget = new widget(widgetOptions);
  };

  renderChart = async () => {
    const {instrument, unsubscribeFromCandle} = this.props;
    await unsubscribeFromCandle!();

    if (!instrument) {
      return;
    }

    this.setState({
      chartReady: false
    });

    this.createWidget();
    this.tvWidget.onChartReady(() => {
      this.setState({
        chartReady: true
      });

      this.addPriceTypeButton();
    });
  };

  addPriceTypeButton = () => {
    const {selectedPriceType, selectPriceType} = this.props;

    const buttonProps = {
      [PriceType.Mid]: {
        cssClass: 'button_mid',
        title: 'Mid price',
        onClick: () => {
          selectPriceType!(PriceType.Trade);
        }
      },
      [PriceType.Trade]: {
        cssClass: 'button_trade',
        title: 'Trades',
        onClick: () => {
          selectPriceType!(PriceType.Mid);
        }
      }
    };

    if (selectedPriceType) {
      const button = buttonProps[selectedPriceType!];

      this.tvWidget
        .createButton()
        .attr('title', button.title)
        .attr('class', `button ${button.cssClass}`)
        .on('click', button.onClick)
        .append(' ');
    }
  };

  saveSettings = () => {
    this.tvWidget.save((settings: any) => {
      settings.priceType = this.props.selectedPriceType;
      this.props.saveSettings!(settings);
    });
  };

  loadSettings = async () => {
    await this.props.loadSettings!()
      .then((res: any) => {
        const settings = JSON.parse(res.Data);

        this.tvWidget.load(settings);

        if (settings.priceType) {
          this.props.selectPriceType!(settings.priceType);
        }
      })
      .catch(err => {
        if (err.status === 404) {
          this.tvWidget.chart().executeActionById('chartReset');
        }
      });
  };

  render() {
    const {containerId, isAuth} = this.props;

    return (
      <ChartWrapper>
        {this.state.chartReady && isAuth ? (
          <ChartControlBar>
            <ButtonWithImg onClick={this.saveSettings} title={'Save layout'}>
              <SvgButton
                xmlns={'http://www.w3.org/2000/svg'}
                viewBox={'0 0 26 18'}
              >
                <path d={savePath} />
              </SvgButton>
            </ButtonWithImg>
            <ButtonWithImg
              onClick={this.loadSettings}
              title={'Load saved layout'}
            >
              <SvgButton
                xmlns={'http://www.w3.org/2000/svg'}
                viewBox={'0 0 26 18'}
              >
                <path d={loadPath} />
              </SvgButton>
            </ButtonWithImg>
          </ChartControlBar>
        ) : null}
        <ChartContainer id={containerId} className={'TVChartContainer'} />
        <ChartPlaceholder isReady={this.state.chartReady} />
        <TransparentDiv id="transparentDiv" />
      </ChartWrapper>
    );
  }
}

export default Chart;
