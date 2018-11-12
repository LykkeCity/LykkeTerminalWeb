import {AnalyticsEventModel} from '../models/analyticsEventModel';

// TODO: clarify the analytics suite
export abstract class AnalyticsService {
  static handlePageLoading = () => {
    // window.analytics.load(process.env.REACT_APP_SEGMENT_WRITE_KEY);
    // window.analytics.page();
  };

  static track = (event: AnalyticsEventModel) => {
    // window.analytics.track(event.title, event.details);
  };

  static handleIdentify = (traits: any): void => {
    // window.analytics.identify(traits);
  };
}
