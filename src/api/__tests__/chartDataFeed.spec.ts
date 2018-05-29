import {ChartDataFeed} from '../';
import {candlesLimit} from '../../constants/chartDefaultSettings';
import dates from '../../constants/dateKeys';
import {InstrumentModel} from '../../models';

const api: any = {
  fetchCandles: jest.fn()
};
const config = {
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
const instrument = new InstrumentModel({
  id: 'BTCUSD',
  name: 'BTC/USD'
});
const startDate = new Date('2018-03-26T12:00:00Z').getTime();
const generateBars = (limit: number) => {
  const candles = [];

  for (let i = 0; i < limit; i++) {
    candles.push({
      time: startDate + dates.day * i,
      close: 8450,
      hight: 8500,
      low: 8400,
      open: 8430,
      volume: 15,
      isBarClosed: true,
      isLastBar: false
    });
  }

  return candles;
};

let chartDataFeed: ChartDataFeed;
let bars: any[];
let barsQty: number;

fdescribe('chart data feed', () => {
  beforeEach(() => {
    chartDataFeed = new ChartDataFeed(
      config,
      instrument,
      api,
      null,
      () => null
    );
  });

  it('getBars, filterAndLimitBars and resetTimeRange methods should be defined', () => {
    expect(chartDataFeed.getBars).toBeDefined();
    expect(chartDataFeed.filterAndLimitBars).toBeDefined();
    expect(chartDataFeed.resetTimeRange).toBeDefined();
  });

  it('filterAndLimitBars method should set limit and count bars', () => {
    barsQty = 500;
    bars = generateBars(barsQty);
    chartDataFeed.filterAndLimitBars(bars);

    expect(chartDataFeed.getTimeRange.barsCount).toBe(candlesLimit);
    expect(chartDataFeed.getTimeRange.isCandlesLimitReached).toBeTruthy();
  });

  it('filterAndLimitBars method should count bars but limit is not reached', () => {
    barsQty = 300;
    bars = generateBars(barsQty);
    chartDataFeed.filterAndLimitBars(bars);

    expect(chartDataFeed.getTimeRange.barsCount).toBe(300);
    expect(chartDataFeed.getTimeRange.isCandlesLimitReached).toBeFalsy();
  });

  it('filterAndLimitBars method should set limit and count bars when getBars was called several times', () => {
    barsQty = 300;
    bars = generateBars(barsQty);
    chartDataFeed.filterAndLimitBars(bars);
    chartDataFeed.filterAndLimitBars(bars);

    expect(chartDataFeed.getTimeRange.barsCount).toBe(candlesLimit);
    expect(chartDataFeed.getTimeRange.isCandlesLimitReached).toBeTruthy();
  });

  it('filterAndLimitBars method should set limit and count bars when getBars was called several times', () => {
    barsQty = 400;
    bars = generateBars(barsQty);
    chartDataFeed.filterAndLimitBars(bars);

    const firstPosFromSecondQuery = barsQty - (candlesLimit - barsQty);
    const firstBarFromSecondQuery = chartDataFeed.filterAndLimitBars(bars)[0];

    expect(firstBarFromSecondQuery.time).toBe(
      startDate + dates.day * firstPosFromSecondQuery
    );
  });

  it('resetTimeRange method should reset barsCount and limit', () => {
    barsQty = 600;
    bars = generateBars(barsQty);
    chartDataFeed.filterAndLimitBars(bars);
    chartDataFeed.resetTimeRange('BTC/USD', '1W');

    expect(chartDataFeed.getTimeRange.barsCount).toBe(0);
    expect(chartDataFeed.getTimeRange.isCandlesLimitReached).toBeFalsy();
    expect(chartDataFeed.getTimeRange.symbol).toBe('BTC/USD');
    expect(chartDataFeed.getTimeRange.resolution).toBe('1W');
  });
});
