import {OperationType} from '../models/index';
import {HistoryApi} from './index';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

type TradeRequest = (
  walletId: string,
  instrumentId: string,
  skip: number,
  take: number,
  operationType: OperationType[]
) => ApiResponse;

type PublicTradeRequest = (
  instrumentId: string,
  skip: number,
  take: number
) => ApiResponse;

export interface TradeApi {
  fetchTrades: TradeRequest;
  fetchPublicTrades: PublicTradeRequest;
}

export class RestTradeApi extends RestApi implements TradeApi {
  fetchTrades = (
    walletId: string,
    instrumentId: string,
    skip: number,
    take: number
  ) =>
    HistoryApi.fetchHistory(walletId, {
      assetPairId: instrumentId,
      skip,
      take,
      operationType: [OperationType.Trade, OperationType.LimitTrade]
    });

  fetchPublicTrades = (instrumentId: string, skip: number, take: number) =>
    HistoryApi.fetchTradesByInstrument(instrumentId, skip, take);
}

export default TradeApi;
