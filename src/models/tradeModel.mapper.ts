import {add, reject} from 'rambda';
import {InstrumentModel, Side, TradeModel} from '.';
import {precisionCeil, precisionFloor, precisionRound} from '../utils/math';
import {mapHistoryTypeToOrderType} from './mappers';
import SideDirection from './sideDirection';

interface TradeValue {
  volume: number;
  oppositeVolume: number;
  assetId: string;
  price: number;
}

const withVolume = (x: TradeValue) => x.volume === 0 || x.oppositeVolume === 0;

export const mapToEffectivePrice = (
  trades: TradeValue[] = [],
  baseAssetId: string,
  accuracy: number = 0,
  side: SideDirection
) => {
  if (trades.length === 0) {
    return undefined;
  }

  const tradesWithVolumes = reject(withVolume, trades);
  const volumeSum = tradesWithVolumes.map(x => x.volume).reduce(add, 0);
  const oppositeVolumeSum = tradesWithVolumes
    .map(x => x.oppositeVolume)
    .reduce(add, 0);

  if (tradesWithVolumes.length === 0) {
    return trades[0].price;
  }
  if (tradesWithVolumes.length === 1) {
    return tradesWithVolumes[0].price;
  }

  const effectivePrice =
    baseAssetId === trades[0].assetId
      ? oppositeVolumeSum / volumeSum
      : volumeSum / oppositeVolumeSum;

  return side === SideDirection.Buy
    ? precisionCeil(effectivePrice, accuracy)
    : precisionFloor(effectivePrice, accuracy);
};

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

export const fromWampToTrade = (dto: any[], instruments: InstrumentModel[]) => {
  const instrument = instruments.find(
    i =>
      (i.baseAsset.id === dto[0].Asset &&
        i.quoteAsset.id === dto[0].OppositeAsset) ||
      (i.baseAsset.id === dto[0].OppositeAsset &&
        i.quoteAsset.id === dto[0].Asset)
  );
  const baseAssetId = instrument!.baseAsset.id;
  const tradesByBaseAsset = dto.filter(x => x.Asset === baseAssetId);
  const {TradeId, DateTime, OrderType, Direction} = tradesByBaseAsset[0];
  const effectivePrice = mapToEffectivePrice(
    tradesByBaseAsset.map(({Volume, OppositeVolume, Asset, Price}) => ({
      volume: Volume,
      oppositeVolume: OppositeVolume,
      assetId: Asset,
      price: Price
    })),
    baseAssetId,
    instrument!.accuracy,
    Direction
  );
  return new TradeModel({
    id: TradeId,
    price: effectivePrice,
    quantity: Math.abs(tradesByBaseAsset.map(t => t.Volume).reduce(add)),
    side: Direction === SideDirection.Buy ? Side.Buy : Side.Sell,
    symbol: instrument!.id,
    timestamp: DateTime,
    tradeId: TradeId,
    oppositeQuantity: Math.abs(
      tradesByBaseAsset.map(t => t.OppositeVolume).reduce(add)
    ),
    orderType: mapHistoryTypeToOrderType(OrderType),
    fee: tradesByBaseAsset.map(t => t.Fee && t.Fee.Volume).reduce(add, 0)
  });
};

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
