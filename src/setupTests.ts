(window as any).requestAnimationFrame = callback => setTimeout(callback, 0);

const tradingView = {
  widget: jest.fn()
};

(window as any).TradingView = tradingView;
