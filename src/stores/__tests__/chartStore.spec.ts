import {ChartDataFeed} from '../../api';
import {AssetModel, InstrumentModel} from '../../models';
import {ChartStore, RootStore} from '../index';

describe('chart store', () => {
  let chartStore: ChartStore;
  let rootStore: RootStore;
  const api: any = {
    load: jest.fn(),
    save: jest.fn()
  };

  beforeEach(() => {
    rootStore = new RootStore(true);
    chartStore = new ChartStore(rootStore, api);
  });

  it('should call save api method', async () => {
    chartStore.saveSettings({chart: {pane: []}});

    expect(api.save).toHaveBeenCalled();
  });

  it('should call load api method', async () => {
    chartStore.loadSettings();

    expect(api.load).toHaveBeenCalled();
  });

  it('should return new Datafeed object', async () => {
    rootStore.uiStore.selectedInstrument = new InstrumentModel({
      id: 'BTCUSD',
      baseAsset: new AssetModel({id: 'BTC', accuracy: 5}),
      quoteAsset: new AssetModel({id: 'USD', accuracy: 2})
    });

    const datafeed = chartStore.getDatafeed();

    expect(datafeed).toBeDefined();
    expect(datafeed instanceof ChartDataFeed).toBeTruthy();
  });

  it('should reset and unsubscribe from candles', async () => {
    chartStore.unsubscribeFromCandle = jest.fn();
    chartStore.reset();

    expect(chartStore.unsubscribeFromCandle).toHaveBeenCalled();
  });
});
