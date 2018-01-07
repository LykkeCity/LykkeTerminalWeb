import {Session} from 'autobahn';

// tslint:disable:no-console
// tslint:disable:object-literal-sort-keys

const symbol = (name = '') => ({
  name: 'BTCUSD',
  minmov: 1,
  pricescale: 10,
  minmove2: 2,
  session: '24x7',
  timezone: 'Europe/Istanbul',
  supported_resolutions: [
    '1',
    '5',
    '15',
    '30',
    '60',
    '240',
    '360',
    '720',
    '1D',
    '1W',
    '1M'
  ],
  has_intraday: true,
  intraday_multipliers: [1, 5, 15, 30, 60, 240, 360, 720],
  has_empty_bars: true
});

class ChartApi {
  constructor(private readonly session: Session, private readonly cfg: any) {}

  onReady = (cb: (configurationData: any) => void) => {
    setTimeout(() => cb(this.cfg), 0);
  };

  searchSymbols = (
    userInput: any,
    exchange = '',
    symbolType = '',
    onResultReadyCallback: (result: any[]) => void
  ) => {
    onResultReadyCallback([symbol('BTCUSD')]);
  };

  resolveSymbol = (
    symbolName: any,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any
  ) => {
    setTimeout(() => onSymbolResolvedCallback(symbol(symbolName)), 0);
  };

  getBars = (
    symbolInfo: any,
    resolution: any,
    from: any,
    to: any,
    onHistoryCallback: any,
    onErrorCallback: any,
    firstDataRequest: any
  ) => {
    const bars: any[] = [];
    if (firstDataRequest) {
      onHistoryCallback(bars, {
        noData: bars.length === 0
      });
    }
  };

  subscribeBars = (
    symbolInfo: typeof symbol,
    resolution: string,
    onRealtimeCallback: any,
    subscriberUID: any,
    onResetCacheNeededCallback: any
  ) => {
    this.session.subscribe('candle.spot.btcusd.bid.minute', (args: any[]) => {
      if (args) {
        const {t, c, o, h, l, v} = args[0];
        console.log(t, c, o, h, l, v);
        onRealtimeCallback({
          time: new Date(t).getTime(),
          close: c,
          open: o,
          high: h,
          low: l,
          volume: v
        });
      }
    });
  };

  unsubscribeBars = (subscriberUID: string) => {
    return undefined;
  };

  calculateHistoryDepth = (
    resolution: string,
    resolutionBack: string,
    intervalBack: string
  ) => {
    return undefined;
  };

  getMarks = () => {
    return undefined;
  };

  getTimescaleMarks = () => {
    return undefined;
  };

  getServerTime = (cb: any) => {
    cb(Date.now());
  };
}

export default ChartApi;
