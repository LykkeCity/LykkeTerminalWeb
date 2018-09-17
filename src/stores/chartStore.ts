import {IWampSubscriptionItem} from '@lykkex/subzero-wamp';
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

  private subscriptions: Set<IWampSubscriptionItem> = new Set();

  constructor(store: RootStore, private readonly api: ChartApi) {
    super(store);
  }

  saveSettings = (settings: any) => {
    this.api.save({Data: JSON.stringify(settings)});
  };

  loadSettings = () => this.api.load();

  subscribeToCandlesWithResolutions = (s: IWampSubscriptionItem) =>
    this.subscriptions.add(s);

  unsubscribeFromCandle = async () => {
    const subscriptions = Array.from(this.subscriptions).map(subscription =>
      this.rootStore.socketStore.unsubscribe(
        subscription.topic,
        subscription.id
      )
    );
    await Promise.all(subscriptions);
    if (this.subscriptions.size > 0) {
      this.subscriptions.clear();
    }
  };

  getDatafeed = () => {
    return new ChartDataFeed(
      ChartStore.config,
      this.rootStore.uiStore.selectedInstrument!,
      new PriceApi(this),
      this.rootStore.socketStore,
      this.subscribeToCandlesWithResolutions
    );
  };

  reset = () => {
    this.unsubscribeFromCandle();
  };
}

export default ChartStore;
