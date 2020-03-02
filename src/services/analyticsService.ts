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

      if (process.env.REACT_APP_ENVIRONMENT !== 'production') {
        // tslint:disable-next-line
        console.log('Amplitude initialized');
      }
    }
  };

  handlePageLoading = () => {
    // window.analytics.load(process.env.REACT_APP_SEGMENT_WRITE_KEY);
    // window.analytics.page();
  };

  track = (event: EventModel) => {
    if (this.amplitudeInitialized) {
      Amplitude.track(event);

      if (process.env.REACT_APP_ENVIRONMENT !== 'production') {
        // tslint:disable-next-line
        console.log(event.title, event.details);
      }
    }
  };

  setUserId = (email: string) => {
    if (this.amplitudeInitialized) {
      const hashedEmail = getHash(email, 'sha256');
      Amplitude.setUserId(hashedEmail);

      if (process.env.REACT_APP_ENVIRONMENT !== 'production') {
        // tslint:disable-next-line
        console.log('Amplitude.setUserId', email, hashedEmail);
      }
    }
  };

  handleIdentify = (traits: any): void => {
    // tslint:disable-next-line
    console.log('Amplitude.identify', traits);
    Amplitude.identify(traits);
  };
}

export default new AnalyticsService();
