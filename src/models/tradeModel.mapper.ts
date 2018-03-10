import {Side, TradeModel} from '.';
import {precisionRound} from '../utils/math';
import {mapHistoryTypeToOrderType} from './mappers';

export const fromRestToTradeList = (dto: any[], accuracy: number) =>
  dto.map(
    ({Id, AssetPair, Price, Amount, DateTime, Type, FeeSize}: any) =>
      new TradeModel({
        id: Id,
        price: Price,
        quantity: Math.abs(Amount),
        side: Amount > 0 ? Side.Buy : Side.Sell,
        symbol: AssetPair,
        timestamp: DateTime,
        tradeId: Id,
        oppositeQuantity: Math.abs(precisionRound(Amount * Price, accuracy)),
        orderType: mapHistoryTypeToOrderType(Type),
        fee: FeeSize
      })
  );

export const fromRestToPublicTrade = ({
  id,
  assetPairId,
  volume,
  price,
  action,
  dateTime
}: any) =>
  new TradeModel({
    id,
    quantity: volume,
    symbol: assetPairId,
    price,
    side: Side[action],
    timestamp: dateTime
  });

export const fromWampToPublicTrade = ({
  Id,
  AssetPairId,
  Volume,
  Price,
  Action,
  DateTime
}: any) =>
  new TradeModel({
    id: Id,
    quantity: Volume,
    symbol: AssetPairId,
    price: Price,
    side: Side[Action],
    timestamp: DateTime
  });
