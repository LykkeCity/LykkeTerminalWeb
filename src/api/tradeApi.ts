import {InstrumentModel, OperationType} from '../models/index';
import {HistoryApi} from './index';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface TradeApi {
  fetchTrades: (
    instrument: InstrumentModel,
    skip: number,
    take: number
  ) => ApiResponse;
  fetchPublicTrades: (
    instrumentId: string,
    skip: number,
    take: number
  ) => ApiResponse;
}

export class RestTradeApi extends RestApi implements TradeApi {
  fetchTrades = async (
    instrument: InstrumentModel | undefined,
    skip: number,
    take: number
  ) => {
    const respTrades = (await HistoryApi.fetchHistory({
      assetPairId: (instrument && instrument.id) || '',
      skip,
      take,
      operationType: OperationType.Trade
    })) as any[];
    const respLimitTrades = (await HistoryApi.fetchHistory({
      assetPairId: (instrument && instrument.id) || '',
      skip,
      take,
      operationType: OperationType.LimitTrade
    })) as any[];
    return [...respTrades, ...respLimitTrades];
  };

  fetchPublicTrades = (instrumentId: string, skip: number, take: number) =>
    HistoryApi.fetchTradesByInstrument(instrumentId, skip, take);
}

export default TradeApi;
