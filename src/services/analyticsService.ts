import {AnalyticsEventModel} from '../models/analyticsEventModel';

export abstract class AnalyticsService {
  static handlePageLoading = () => {
    window.analytics.load(process.env.REACT_APP_SEGMENT_WRITE_KEY);
    window.analytics.page();
  };

  static track = (event: AnalyticsEventModel) => {
    window.analytics.track(event.title, event.details);
  };

  static handleIdentify = (id: string, traits: any): void => {
    window.analytics.identify(id, traits);
  };
}
