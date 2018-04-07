import {uniq} from 'rambda';
import * as topics from '../api/topics';
import {InstrumentModel, MarketType, PriceType} from '../models/index';
import * as mappers from '../models/mappers/index';
import {dateFns} from '../utils/index';
import {PriceApi} from './index';

class ChartDataFeed {
  constructor(
    private readonly config: any,
    private readonly instrument: InstrumentModel,
    private readonly priceApi: PriceApi,
    private readonly session: any
  ) {}

  onReady = (cb: any) => {
    setTimeout(() => cb(this.config), 0);
  };

  searchSymbols = (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: any
  ) => {
    onResultReadyCallback([mappers.mapToChartSymbol(this.instrument)]);
  };

  resolveSymbol = (
    symbolName: string,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any
  ) => {
    const symbol = mappers.mapToChartSymbol(this.instrument);
    setTimeout(() => onSymbolResolvedCallback(symbol), 0);
  };

  getBars = async (
    symbolInfo: any,
    resolution: any,
    from: any,
    to: any,
    onHistoryCallback: any,
    onErrorCallback: any,
    firstDataRequest: any
  ) => {
    const timePeriods = dateFns.splitter(from * 1000, to * 1000, resolution);
    const promises = timePeriods!.map(period =>
      this.priceApi.fetchCandles(
        this.instrument.id,
        new Date(period.from),
        firstDataRequest ? new Date() : new Date(period.to),
        mappers.mapChartResolutionToWampInterval(resolution)
      )
    );

    await Promise.all(promises).then(
      resp => {
        resp = uniq(
          resp.reduce((prev, current) => prev.concat(current.History), [])
        );

        const bars = resp.map(mappers.mapToBarFromRest);

        if (bars.length > 0) {
          // tslint:disable-next-line:no-unused-expression
          onHistoryCallback && onHistoryCallback(bars);
        } else {
          // tslint:disable-next-line:no-unused-expression
          onHistoryCallback && onHistoryCallback([], {noData: true});
        }
      },
      reject => {
        switch (reject.status) {
          default:
          case 404:
            onHistoryCallback([], {noData: true});
            break;
          case 429:
            setTimeout(
              () =>
                this.getBars(
                  symbolInfo,
                  resolution,
                  from,
                  to,
                  onHistoryCallback,
                  onErrorCallback,
                  firstDataRequest
                ),
              2000
            );
            break;
        }
      }
    );
  };

  subscribeBars = (
    symbolInfo: typeof mappers.mapToChartSymbol,
    resolution: string,
    onRealtimeCallback: any,
    subscriberUID: any,
    onResetCacheNeededCallback: any
  ) => {
    this.session.subscribe(
      topics.candle(
        MarketType.Spot,
        this.instrument.id,
        PriceType.Trade,
        mappers.mapChartResolutionToWampInterval(resolution)
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
