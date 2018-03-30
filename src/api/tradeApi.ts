import {OperationType} from '../models/index';
import {HistoryApi} from './index';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

type TradeRequest = (
  instrumentId: string,
  skip: number,
  take: number
) => ApiResponse;

export interface TradeApi {
  fetchTrades: TradeRequest;

  fetchPublicTrades: TradeRequest;
}

export class RestTradeApi extends RestApi implements TradeApi {
  fetchTrades = (instrumentId: string, skip: number, take: number) =>
    HistoryApi.fetchHistory({
      assetPairId: instrumentId,
      skip,
      take,
      operationType: OperationType.Trade
    });

  fetchLimitTrades = (instrumentId: string, skip: number, take: number) =>
    HistoryApi.fetchHistory({
      assetPairId: instrumentId,
      skip,
      take,
      operationType: OperationType.LimitTrade
    });

  fetchPublicTrades = (instrumentId: string, skip: number, take: number) =>
    HistoryApi.fetchTradesByInstrument(instrumentId, skip, take);
}

export default TradeApi;
