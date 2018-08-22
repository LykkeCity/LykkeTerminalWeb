import {ISubscription} from 'autobahn';
import {isBefore, isEqual} from 'date-fns';
import {action, computed, observable, runInAction} from 'mobx';
import {PriceApi} from '../api';
import * as topics from '../api/topics';
import {
  chartIndicators,
  chartInterval,
  DEFAULT_SCALE,
  IchartIndicator,
  IchartInterval
} from '../constants/priceChartConstants';
import {
  ChartCandleModel,
  ChartCandleResponseModel,
  ChartCandleWampResponseModel,
  MarketType,
  PriceType,
  StockChartType
} from '../models';
import {
  mapToChartCandleModel,
  mapToChartCandleModelFromWamp
} from '../models/mappers/candleMapper';
import {getChartFromDate} from '../utils/dateFns';
import {BaseStore, RootStore} from './index';

class ChartStore extends BaseStore {
  @computed
  get initialData() {
    return this.candles.map(candle => candle);
  }

  static readonly intervals = [
    chartInterval.min5,
    chartInterval.min15,
    chartInterval.min30,
    chartInterval.hour,
    chartInterval.hour4,
    chartInterval.hour6,
    chartInterval.hour12,
    chartInterval.day,
    chartInterval.week,
    chartInterval.month
  ];

  static readonly chartTypes = [
    StockChartType.Candles,
    StockChartType.Line,
    StockChartType.Area
  ];

  @observable hasPendingCandles: boolean = false;
  @observable selectedChartInterval: IchartInterval = chartInterval.day;
  @observable selectedChartType: StockChartType = StockChartType.Area;
  @observable isIndicatorsPopupShown: boolean = false;
  @observable fullScreenMode: boolean = false;
  @observable
  indicators: IchartIndicator[] = Object.keys(chartIndicators).map(
    (indicatorName: string) => chartIndicators[indicatorName]
  );

  @observable private candles: ChartCandleModel[] = [];
  private dateTo: Date;
  private firstLoad: boolean = true;
  private subscriptions: Set<ISubscription> = new Set();

  constructor(store: RootStore, private readonly priceApi: PriceApi) {
    super(store);
  }

  @action
  toggleChartType = (type: string) =>
    (this.selectedChartType = StockChartType[type]);

  @action
  toggleChartInterval = (interval: string) => {
    this.selectedChartInterval = chartInterval[interval];
    this.fetchCandlesFirstTime();
  };

  @action
  toggleIndicatorsPopup = () =>
    (this.isIndicatorsPopupShown = !this.isIndicatorsPopupShown);

  @action
  toggleIndicator = (indicatorName: string) =>
    (this.indicators = this.indicators.map((indicator: IchartIndicator) => {
      if (indicator.value === indicatorName) {
        indicator.isActive = !indicator.isActive;
      }
      return indicator;
    }));

  @action
  toggleFullScreenMode = () => (this.fullScreenMode = !this.fullScreenMode);

  @action
  updateDataByWamp = (data: ChartCandleWampResponseModel) => {
    let duplicateIndex;
    const newCandle = mapToChartCandleModelFromWamp(data);

    this.candles.forEach((candleToCompare: ChartCandleModel, index: number) => {
      duplicateIndex = isEqual(newCandle.date, candleToCompare.date)
        ? index
        : null;
    });

    duplicateIndex
      ? this.candles.splice(duplicateIndex, 1, newCandle)
      : this.candles.push(newCandle);
  };

  @action
  fetchCandles = async (scale: number = DEFAULT_SCALE) => {
    this.hasPendingCandles = true;

    const instrumentId = this.rootStore.uiStore.selectedInstrument!.id;
    const interval = this.selectedChartInterval.value;
    const to = this.firstLoad ? new Date() : this.dateTo;
    let from = new Date(to.getTime() - getChartFromDate(interval, scale));

    if (this.dateTo && isBefore(this.dateTo, from)) {
      from = this.dateTo;
    }

    let candles = await this.priceApi.fetchCandles(
      instrumentId,
      from,
      to,
      interval
    );

    if (candles.History.length > 0) {
      runInAction(() => {
        candles = candles.History.map((candle: ChartCandleResponseModel) =>
          mapToChartCandleModel(candle)
        );
        this.candles = this.firstLoad
          ? candles
          : candles.concat(this.initialData);
      });
    }

    this.dateTo = from;
    this.hasPendingCandles = false;

    return candles;
  };

  fetchCandlesFirstTime = async () => {
    this.firstLoad = true;

    await this.unsubscribeFromCandles();
    await this.fetchCandles();
    await this.subscribeCandles();

    this.firstLoad = false;
  };

  subscribeCandles = async () => {
    this.subscriptions.add(
      await this.getWs().subscribe(
        topics.candle(
          MarketType.Spot,
          this.rootStore.uiStore.selectedInstrument!.id,
          PriceType.Trade,
          this.selectedChartInterval.value
        ),
        (args: any[]) => {
          if (args) {
            this.updateDataByWamp(args[0]);
          }
        }
      )
    );
  };

  unsubscribeFromCandles = async () => {
    const subscriptions = Array.from(this.subscriptions).map(
      s => this.getWs() && this.getWs().unsubscribe(s)
    );

    await Promise.all(subscriptions);

    if (this.subscriptions.size > 0) {
      this.subscriptions.clear();
    }
  };

  reset = () => {
    this.unsubscribeFromCandles();
  };
}

export default ChartStore;
