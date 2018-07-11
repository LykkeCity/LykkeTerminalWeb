import {AppInsights} from 'applicationinsights-js';

class Logger {
  constructor() {
    AppInsights.downloadAndSetup!({
      instrumentationKey: process.env.REACT_APP_INSIGHTS_ID
    });

    window.addEventListener('error', this.logException);
  }

  logException(error: any) {
    AppInsights.trackException(error);

    return true;
  }
}

export default new Logger();
