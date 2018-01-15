import {Session} from 'autobahn';
import * as topics from '../api/topics';
import {MarketType, PriceType} from '../models/index';
import * as mappers from '../models/mappers/index';
import {UiStore} from '../stores/index';
import {PriceApi} from './index';

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
  private instrumentId: string = UiStore.DEFAULT_INSTRUMENT;

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
        const bars = resp.History.map(mappers.mapAsBarFromRest);
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
      topics.candle(
        MarketType.Spot,
        this.instrumentId,
        PriceType.Bid,
        'minute'
      ),
      (args: any[]) => {
        if (args) {
          onRealtimeCallback(mappers.mapAsBarFromWamp(args[0]));
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

export default ChartApi;
