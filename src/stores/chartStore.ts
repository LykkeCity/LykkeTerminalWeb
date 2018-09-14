import {ISubscription} from 'autobahn';
import {ChartApi, ChartDataFeed, PriceApi} from '../api';
import {BaseStore, RootStore} from './index';

class ChartStore extends BaseStore {
  static readonly config = {
    supports_search: false,
    exchanges: [],
    supported_resolutions: [
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

  private subscriptions: Set<ISubscription> = new Set();

  constructor(store: RootStore, private readonly api: ChartApi) {
    super(store);
  }

  saveSettings = (settings: any) => {
    this.api.save({Data: JSON.stringify(settings)});
  };

  loadSettings = () => this.api.load();

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

  getDatafeed = () => {
    return new ChartDataFeed(
      ChartStore.config,
      this.rootStore.uiStore.selectedInstrument!,
      new PriceApi(this.rootStore),
      this.getWs(),
      this.subscribeToCandlesWithResolutions
    );
  };

  reset = () => {
    this.unsubscribeFromCandle();
  };
}

export default ChartStore;
