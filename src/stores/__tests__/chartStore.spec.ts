import {ChartStore, RootStore} from '../index';

describe('chart store', () => {
  let chartStore: ChartStore;
  let rootStore: RootStore;
  const priceApi: any = {
    fetchCandles: jest.fn()
  };

  beforeEach(() => {
    rootStore = new RootStore(true);
    chartStore = new ChartStore(rootStore, priceApi);
  });

  it('should reset and unsubscribe from candles', async () => {
    chartStore.unsubscribeFromCandles = jest.fn();
    chartStore.reset();

    expect(chartStore.unsubscribeFromCandles).toHaveBeenCalled();
  });
});
