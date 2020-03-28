import {Amplitude, EventModel} from '@lykkex/lykke.js';
import {getHash} from '../utils/string';

// TODO: clarify the analytics suite
class AnalyticsService {
  private amplitudeId = process.env.REACT_APP_AMPLITUDE_ID;
  private amplitudeInitialized: boolean = false;

  init = () => {
    if (this.amplitudeId) {
      Amplitude.setup(this.amplitudeId);
      this.amplitudeInitialized = true;
    }
  };

  handlePageLoading = () => {
    // window.analytics.load(process.env.REACT_APP_SEGMENT_WRITE_KEY);
    // window.analytics.page();
  };

  track = (event: EventModel) => {
    if (this.amplitudeInitialized) {
      Amplitude.track(event);
    }
  };

  setUserId = (email: string) => {
    if (this.amplitudeInitialized) {
      const hashedEmail = getHash(email, 'sha256');
      Amplitude.setUserId(hashedEmail);
    }
  };

  handleIdentify = (traits: any): void => {
    Amplitude.identify(traits);
  };
}

export default new AnalyticsService();
