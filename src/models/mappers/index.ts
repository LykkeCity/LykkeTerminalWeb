import {
  AssetCategoryModel,
  AssetModel,
  AssetResponseModel,
  DescriptionResponseModel,
  InstrumentModel,
  OrderModel,
  OrderType
} from '../index';
import WatchlistModel from '../watchlistModel';

export const mapToBarFromRest = ({
  DateTime,
  Close,
  Open,
  High,
  Low,
  Volume = 0
}: any) => ({
  close: Close,
  high: High,
  low: Low,
  open: Open,
  time: new Date(DateTime).getTime(),
  volume: Volume
});

export const mapToBarFromWamp = ({t, c, o, h, l, v}: any) => ({
  close: c,
  high: h,
  low: l,
  open: o,
  time: new Date(t).getTime(),
  volume: v
});

export const mapToLimitOrder = ({
  Id,
  CreateDateTime,
  OrderAction,
  Voume,
  Volume,
  RemainingVolume,
  Price,
  AssetPairId
}: any) =>
  new OrderModel({
    createdAt: new Date(CreateDateTime),
    id: Id,
    price: Number(Price),
    side: OrderAction,
    symbol: AssetPairId,
    volume: Volume || Voume,
    remainingVolume: RemainingVolume
  });

export const filterByInstrumentsAndMapToLimitOrder = (
  instruments: InstrumentModel[],
  orders: any
) =>
  orders.reduce((limitOrders: any[], order: any) => {
    if (instruments.find(i => i.id === order.AssetPairId)) {
      limitOrders.push(mapToLimitOrder(order));
    }
    return limitOrders;
  }, []);

export const mapToWatchlist = ({
  Id,
  Name,
  AssetPairIds,
  ReadOnly,
  Order
}: any) =>
  new WatchlistModel({
    assetPairIds: AssetPairIds,
    id: Id,
    name: Name,
    readOnly: ReadOnly,
    order: Order
  });

export const mapHistoryTypeToOrderType = (type: string) => {
  switch (type) {
    case 'Market':
    case 'Trade':
      return OrderType.Market;
    case 'Limit':
    case 'LimitTrade':
      return OrderType.Limit;
    default:
      break;
  }
  return undefined;
};

export const mapToAsset = (
  {
    Id,
    Name,
    DisplayId,
    CategoryId,
    Accuracy,
    IconUrl,
    CanBeBase
  }: AssetResponseModel,
  categories: AssetCategoryModel[],
  {FullName}: DescriptionResponseModel
) =>
  new AssetModel({
    accuracy: Accuracy,
    category:
      categories.find(x => x.id === CategoryId) || AssetCategoryModel.Other(),
    iconUrl: IconUrl,
    id: Id,
    canBeBase: CanBeBase,
    fullName: FullName || '',
    name: DisplayId || Name
  });

export const mapToAssetCategory = ({Id: id, Name: name}: any) =>
  new AssetCategoryModel({id, name});

export const mapToInstrument = (
  {Id, Accuracy, BaseAssetId, InvertedAccuracy, Name, QuotingAssetId}: any,
  getAssetById: (assetId: string) => AssetModel | undefined
) =>
  new InstrumentModel({
    id: Id,
    name: Name,
    baseAsset: getAssetById(BaseAssetId),
    quoteAsset: getAssetById(QuotingAssetId),
    accuracy: Accuracy,
    invertedAccuracy: InvertedAccuracy
  });

export const mapToPublicInstrument = (
  {Id, Accuracy, BaseAssetId, InvertedAccuracy, Name, QuotingAssetId}: any,
  getAssetById: (assetId: string) => AssetModel | undefined
) =>
  new InstrumentModel({
    id: Id,
    name: Name,
    baseAsset: getAssetById(BaseAssetId),
    quoteAsset: getAssetById(QuotingAssetId),
    accuracy: Accuracy,
    invertedAccuracy: InvertedAccuracy
  });
