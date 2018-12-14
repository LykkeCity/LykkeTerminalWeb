import raven from 'raven-js';

// tslint:disable-next-line:no-var-requires
const {version} = require('../package.json');

class Logger {
  constructor() {
    raven
      .config(process.env.REACT_APP_SENTRY_DNS || '', this.getRavenConfig())
      .install();

    window.addEventListener('error', this.logException);
  }

  logException(error: any) {
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
