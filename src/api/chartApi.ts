import {Session} from 'autobahn';
import wretch from 'wretch';

// tslint:disable:no-console
// tslint:disable:object-literal-sort-keys

const symbol = (name = '') => ({
  name,
  minmov: 1,
  pricescale: 1,
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
  intraday_multipliers: ['1', '5', '15', '30', '60', '240', '360', '720'],
  has_empty_bars: true
});

class ChartApi {
  private instrumentId: string = 'BTCUSD';

  constructor(
    private readonly session: Session,
    private readonly cfg: any,
    instrumentId: string
  ) {
    this.instrumentId = instrumentId;
  }

  onReady = (cb: (configurationData: any) => void) => {
    setTimeout(() => cb(this.cfg), 0);
  };

  searchSymbols = (
    userInput: any,
    exchange = '',
    symbolType = '',
    onResultReadyCallback: (result: any[]) => void
  ) => {
    onResultReadyCallback([symbol(this.instrumentId)]);
  };

  resolveSymbol = (
    symbolName: any,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any
  ) => {
    setTimeout(() => onSymbolResolvedCallback(symbol(this.instrumentId)), 0);
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
    if (firstDataRequest) {
      wretch(
        `https://public-api.lykke.com/api/Candles/history/${
          this.instrumentId
        }/spot`
      )
        .json({
          period: 'minute',
          type: 'Bid',
          // dateFrom: new Date(2018, 1, 1).toISOString(),
          // dateTo: new Date(2018, 1, 7).toISOString()
          dateFrom: new Date(new Date(Date.now()).setHours(-12)).toISOString(),
          dateTo: new Date(Date.now()).toISOString()
        })
        .post()
        .json()
        .then(resp => {
          const bars = resp.data
            .map(mapAsBar)
            .sort((a: any, b: any) => b.time - a.time)
            .reverse();
          onHistoryCallback(bars, {
            noData: bars.length === 0,
            nextTime: Math.max(bars.map((x: any) => x.time))
          });
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
    this.session.subscribe(
      `candle.spot.${this.instrumentId.toLowerCase()}.bid.5min`,
      (args: any[]) => {
        if (args) {
          onRealtimeCallback(mapAsBar(args[0]));
        }
      }
    );
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

const mapAsBar = ({t, c, o, h, l, v}: any) => ({
  time: new Date(t).getTime(),
  close: c,
  open: o,
  high: h,
  low: l,
  volume: v
});

export default ChartApi;
