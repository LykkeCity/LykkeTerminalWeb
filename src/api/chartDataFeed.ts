import * as topics from '../api/topics';
import {InstrumentModel, MarketType, PriceType} from '../models/index';
import * as mappers from '../models/mappers/index';
import {PriceApi, WampApi} from './index';

class ChartDataFeed {
  constructor(
    private readonly priceApi: PriceApi,
    private readonly config: any,
    private readonly instrument: InstrumentModel
  ) {}

  onReady = (cb: (configurationData: any) => void) => {
    setTimeout(() => cb(this.config), 0);
  };

  searchSymbols = (
    userInput: any,
    exchange = '',
    symbolType = '',
    onResultReadyCallback: (result: any[]) => void
  ) => {
    onResultReadyCallback([mappers.mapToChartSymbol(this.instrument)]);
  };

  resolveSymbol = (
    symbolName: any,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any
  ) => {
    setTimeout(
      () => onSymbolResolvedCallback(mappers.mapToChartSymbol(this.instrument)),
      0
    );
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
    this.priceApi
      .fetchHistory(
        this.instrument.id,
        new Date(from * 1000),
        firstDataRequest ? new Date() : new Date(to * 1000),
        'Minute'
      )
      .then(resp => {
        const bars = resp.History.map(mappers.mapToBarFromRest);
        if (bars) {
          onHistoryCallback(bars);
        } else {
          onHistoryCallback([], {noData: true});
        }
      });
  };

  subscribeBars = (
    symbolInfo: typeof mappers.mapToChartSymbol,
    resolution: string,
    onRealtimeCallback: any,
    subscriberUID: any,
    onResetCacheNeededCallback: any
  ) => {
    WampApi.subscribe(
      topics.candle(
        MarketType.Spot,
        this.instrument.id,
        PriceType.Bid,
        'minute'
      ),
      (args: any[]) => {
        if (args) {
          onRealtimeCallback(mappers.mapToBarFromWamp(args[0]));
        }
      }
    );
  };

  unsubscribeBars = (subscriberUID: string) => {
    return undefined; // TODO: implement unsubscription
  };

  getServerTime = (cb: any) => {
    cb(Math.round(Date.now() / 1000));
  };
}

export default ChartDataFeed;
