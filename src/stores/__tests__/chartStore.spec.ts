import {chartInterval} from '../../constants/priceChartConstants';
import {AssetModel, InstrumentModel, StockChartType} from '../../models';
import {ChartStore, RootStore} from '../index';

describe('chart store', () => {
  let chartStore: ChartStore;
  let rootStore: RootStore;
  const candlesHistory = [
    {
      Close: 16006.411,
      DateTime: '2018-01-08T00:00:00Z',
      High: 16102.559,
      Low: 15877.555,
      Open: 16068.188,
      OppositeVolume: 907.8,
      Volume: 0.05640132
    },
    {
      Close: 16006.411,
      DateTime: '2018-01-09T00:00:00Z',
      High: 16102.559,
      Low: 15877.555,
      Open: 16068.188,
      OppositeVolume: 907.8,
      Volume: 0.03790569
    },
    {
      Close: 16006.411,
      DateTime: '2018-01-10T00:00:00Z',
      High: 16102.559,
      Low: 15877.555,
      Open: 16068.188,
      OppositeVolume: 907.8,
      Volume: 36.97634946
    }
  ];
  const priceApi: any = {
    fetchCandles: jest.fn(() =>
      Promise.resolve({
        History: candlesHistory
      })
    )
  };

  beforeEach(() => {
    rootStore = new RootStore(true);
    chartStore = new ChartStore(rootStore, priceApi);
    rootStore.uiStore.selectedInstrument = new InstrumentModel({
      baseAsset: new AssetModel({name: 'BTC'}),
      id: 'BTCUSD',
      quoteAsset: new AssetModel({name: 'USD'})
    });
  });

  it('should set new chart interval', () => {
    const interval = 'hour';
    expect(chartStore.selectedChartInterval).toEqual(chartInterval.day);
    chartStore.setChartInterval(interval);
    expect(chartStore.selectedChartInterval).toEqual(chartInterval[interval]);
  });

  it('should set new chart interval', () => {
    const type = StockChartType.Candles;
    expect(chartStore.selectedChartType).toBe(StockChartType.Area);
    chartStore.toggleChartType(type);
    expect(chartStore.selectedChartType).toEqual(type);
  });

  it('should toggle indicators popup', () => {
    expect(chartStore.isIndicatorsPopupShown).toBe(false);
    chartStore.toggleIndicatorsPopup();
    expect(chartStore.isIndicatorsPopupShown).toBe(true);
  });

  it('should activate macd indicator', () => {
    const indicatorName = 'macd';
    const macd = () =>
      chartStore.indicators.find(
        indicator => indicator.value === indicatorName
      );
    expect(chartStore.indicators).toBeDefined();
    expect(macd()!.isActive).toBe(false);
    chartStore.toggleIndicator(indicatorName);
    expect(macd()!.isActive).toBe(true);
  });

  it('should toggle full screen mode', () => {
    expect(chartStore.fullScreenMode).toBe(false);
    chartStore.toggleFullScreenMode();
    expect(chartStore.fullScreenMode).toBe(true);
  });

  it('should fetch candles in calculated range', async () => {
    const candles = await chartStore.fetchCandles();
    const candlesQty = candlesHistory.length;

    expect(chartStore.hasPendingCandles).toBe(false);
    expect(chartStore.initialData.length).toBe(candlesQty);
    expect(candles.length).toBe(candlesQty);
  });

  it('should fetch new candles when chart params have changed', async () => {
    chartStore.subscribeCandles = jest.fn();
    chartStore.unsubscribeFromCandles = jest.fn();
    chartStore.fetchCandles = jest.fn();

    await chartStore.fetchCandlesWithNewParams();

    expect(chartStore.subscribeCandles).toHaveBeenCalled();
    expect(chartStore.unsubscribeFromCandles).toHaveBeenCalled();
    expect(chartStore.fetchCandles).toHaveBeenCalled();
  });

  it('should reset and unsubscribe from candles', async () => {
    chartStore.unsubscribeFromCandles = jest.fn();

    await chartStore.reset();

    expect(chartStore.unsubscribeFromCandles).toHaveBeenCalled();
  });
});
