import {AnalyticsEventModel} from '../models/analyticsEventModel';

declare global {
  interface Window {
    analytics: any;
  }
}

export abstract class AnalyticsService {
  static handlePageLoading = () => {
    window.analytics.load(process.env.REACT_APP_SEGMENT_WRITE_KEY);
    window.analytics.page();
  };

  static handleClick = (event: AnalyticsEventModel) => {
    window.analytics.track(event.title, event.details);
  };

  static handleClicksOnElement = (
    id: string,
    event: AnalyticsEventModel
  ): void => {
    const element = document.getElementById(id);
    window.analytics.trackClick(element, event.title, event.details);
  };
}
