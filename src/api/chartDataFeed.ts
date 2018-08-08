import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addSeconds,
  addWeeks
} from 'date-fns';
import {uniq} from 'rambda';
import {IWampSubscriptionItem} from 'socket-connection-wamp';
import * as topics from '../api/topics';
import {
  InstrumentModel,
  Interval,
  MarketType,
  PriceType
} from '../models/index';
import * as mappers from '../models/mappers/index';
import {dateFns} from '../utils/index';
import {PriceApi} from './index';

const addTick = (d: Date, interval: Interval) => {
  switch (interval) {
    case 'sec':
      return addSeconds(d, 1);
    case 'minute':
      return addMinutes(d, 1);
    case 'min5':
      return addMinutes(d, 5);
    case 'min15':
      return addMinutes(d, 15);
    case 'min30':
      return addMinutes(d, 30);
    case 'hour':
      return addHours(d, 1);
    case 'hour4':
      return addHours(d, 4);
    case 'hour6':
      return addHours(d, 6);
    case 'hour12':
      return addHours(d, 12);
    case 'day':
      return addDays(d, 1);
    case 'week':
      return addWeeks(d, 1);
    case 'month':
      return addMonths(d, 1);
  }
};

class ChartDataFeed {
  constructor(
    private readonly config: any,
    private instrument: InstrumentModel,
    private readonly priceApi: PriceApi,
    private readonly session: any,
    private readonly subscribeToCandlesWithResolutions: (
      s: IWampSubscriptionItem
    ) => void
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
    const interval = mappers.mapChartResolutionToWampInterval(resolution);
    const promises = timePeriods!.map(period =>
      this.priceApi.fetchCandles(
        this.instrument.id,
        new Date(from * 1000),
        addTick(firstDataRequest ? new Date() : new Date(to * 1000), interval),
        interval
      )
    );

    await Promise.all(promises).then(
      resp => {
        resp = uniq(
          resp.reduce((prev, current) => prev.concat(current.History), [])
        );

        let bars = resp.map(mappers.mapToBarFromRest);

        bars = bars.filter(x => {
          return x.volume !== 0;
        });

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

  subscribeBars = async (
    symbolInfo: typeof mappers.mapToChartSymbol,
    resolution: string,
    onRealtimeCallback: any,
    subscriberUID: any,
    onResetCacheNeededCallback: any
  ) => {
    this.subscribeToCandlesWithResolutions(
      await this.session.subscribe(
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
      )
    );
  };

  unsubscribeBars = (subscriberUID: string) => {
    return undefined; // TODO: implement unsubscription
  };

  getServerTime = (cb: any) => {
    cb(Math.round(Date.now() / 1000));
  };

  setInstrument = (instrument: InstrumentModel) => {
    this.instrument = instrument;
  };
}

export default ChartDataFeed;
