// tslint:disable-next-line:no-var-requires
const AppInsights = require('applicationinsights-js').AppInsights;
import raven from 'raven-js';

// tslint:disable-next-line:no-var-requires
const {version} = require('../package.json');

class Logger {
  constructor() {
    AppInsights.downloadAndSetup!({
      instrumentationKey: process.env.REACT_APP_INSIGHTS_ID
    });
    raven
      .config(process.env.REACT_APP_SENTRY_DNS || '', this.getRavenConfig())
      .install();

    window.addEventListener('error', this.logException);
  }

  logException(error: any) {
    AppInsights.trackException(error);
    raven.captureException(error);

    return true;
  }

  private getRavenConfig() {
    return {
      release: version,
      environment: process.env.NODE_ENV,
      stacktrace: true,
      autoBreadcrumbs: true
    };
  }
}

export default new Logger();
