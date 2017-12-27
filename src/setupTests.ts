(window as any).requestAnimationFrame = callback => setTimeout(callback, 0);

const tradingView = {
  widget: jest.fn()
};

const localStorage = {
  getItem: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn()
};

(window as any).TradingView = tradingView;
(window as any).localStorage = localStorage;
