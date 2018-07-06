import {OperationType} from '../models/index';
import {RootStore} from '../stores';
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
  private historyApi: HistoryApi;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.historyApi = new HistoryApi(rootStore);
  }

  fetchTrades = (instrumentId: string, skip: number, take: number) =>
    this.historyApi.fetchHistory({
      assetPairId: instrumentId,
      skip,
      take,
      operationType: OperationType.Trade
    });

  fetchLimitTrades = (instrumentId: string, skip: number, take: number) =>
    this.historyApi.fetchHistory({
      assetPairId: instrumentId,
      skip,
      take,
      operationType: OperationType.LimitTrade
    });

  fetchPublicTrades = (instrumentId: string, skip: number, take: number) =>
    this.historyApi.fetchTradesByInstrument(instrumentId, skip, take);
}

export default TradeApi;
