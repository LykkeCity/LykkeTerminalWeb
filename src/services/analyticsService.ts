import {Segment} from '@lykkex/lykke.js';
import {AnalyticsEventModel} from '../models/analyticsEventModel';

export abstract class AnalyticsService {
  static handlePageLoading = () => {
    Segment.setup(process.env.REACT_APP_SEGMENT_WRITE_KEY || '');
  };

  static track = (event: AnalyticsEventModel) => {
    Segment.track(event);
  };

  static handleIdentify = (traits: any): void => {
    Segment.identify(traits);
  };
}
