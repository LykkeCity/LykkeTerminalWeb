(window as any).requestAnimationFrame = callback => setTimeout(callback, 0);

const tradingView = {
  widget: jest.fn()
};

const localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  // tslint:disable-next-line:object-literal-sort-keys
  removeItem: jest.fn()
};

(window as any).TradingView = tradingView;
(window as any).localStorage = localStorage;
(window as any).Worker = jest.fn();

jest.mock('applicationinsights-js', () => {
  return {
    AppInsights: {
      downloadAndSetup: jest.fn(),
      trackException: jest.fn()
    }
  };
});

jest.mock('raven-js', () => {
  return {
    config: jest.fn().mockReturnValue({
      install: jest.fn()
    }),
    captureException: jest.fn()
  };
});
