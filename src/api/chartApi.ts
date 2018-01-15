import {Session} from 'autobahn';
import {PriceApi} from './index';

// tslint:disable:no-console
// tslint:disable:object-literal-sort-keys

const symbol = (name = '') => ({
  name,
  minmov: 1,
  pricescale: 1,
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
    new PriceApi()
      .fetchHistory(
        this.instrumentId,
        new Date(from * 1000),
        firstDataRequest ? new Date() : new Date(to * 1000),
        'Minute'
      )
      .then(resp => {
        const bars = resp.History.map(mapAsBarFromRest);
        console.log(bars);
        if (bars) {
          onHistoryCallback(bars);
        } else {
          onHistoryCallback([], {noData: true});
        }
      });
  };

  subscribeBars = (
    symbolInfo: typeof symbol,
    resolution: string,
    onRealtimeCallback: any,
    subscriberUID: any,
    onResetCacheNeededCallback: any
  ) => {
    this.session.subscribe(
      `candle.spot.${this.instrumentId.toLowerCase()}.bid.minute`,
      (args: any[]) => {
        if (args) {
          console.log(args[0]);
          onRealtimeCallback(mapAsBarFromWamp(args[0]));
        }
      }
    );
  };

  unsubscribeBars = (subscriberUID: string) => {
    return undefined;
  };

  getServerTime = (cb: any) => {
    cb(Math.round(Date.now() / 1000));
  };
}

const mapAsBarFromRest = ({
  DateTime,
  Close,
  Open,
  High,
  Low,
  Volume = 0
}: any) => ({
  time: new Date(DateTime).getTime(),
  close: Close,
  open: Open,
  high: High,
  low: Low,
  volume: Volume
});

const mapAsBarFromWamp = ({t, c, o, h, l, v = 0}: any) => ({
  time: new Date(t).getTime(),
  close: c,
  open: o,
  high: h,
  low: l,
  volume: v
});

export default ChartApi;
