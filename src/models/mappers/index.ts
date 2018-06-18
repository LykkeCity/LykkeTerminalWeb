import {pathOr} from 'rambda';
import {LEFT_PADDING, TOP_PADDING} from '../../components/OrderBook';
import {ChartStore} from '../../stores/index';
import {
  AssetCategoryModel,
  AssetModel,
  InstrumentModel,
  Interval,
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

export const mapToChartSymbol = ({
  name,
  accuracy,
  invertedAccuracy,
  baseAsset
}: InstrumentModel) => ({
  name,
  minmov: 1,
  pricescale: Math.pow(10, accuracy),
  session: '24x7',
  timezone: 'Europe/Zurich',
  supported_resolutions: ChartStore.config.supported_resolutions,
  has_intraday: true,
  intraday_multipliers: ['1', '5', '15', '30', '60', '240', '360', '720'],
  has_empty_bars: true,
  volume_precision: pathOr(0, ['accuracy'], baseAsset),
  ticker: name,
  has_daily: true,
  has_weekly_and_monthly: true
});

type ResolutionMapper = (resolution: string) => Interval;
export const mapChartResolutionToWampInterval: ResolutionMapper = resolution => {
  switch (resolution) {
    case '1':
      return 'minute';
    case '5':
      return 'min5';
    case '15':
      return 'min15';
    case '30':
      return 'min30';
    case '60':
      return 'hour';
    case '240':
      return 'hour4';
    case '360':
      return 'hour6';
    case '720':
      return 'hour12';
    case 'D':
    case '1D':
      return 'day';
    case 'W':
    case '1W':
      return 'week';
    case 'M':
    case '1M':
      return 'month';

    default:
      return 'day';
  }
};

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
  {Id, Name, DisplayId, CategoryId, Accuracy, IconUrl, CanBeBase}: any,
  categories: AssetCategoryModel[]
) =>
  new AssetModel({
    accuracy: Accuracy,
    category:
      categories.find(x => x.id === CategoryId) || AssetCategoryModel.Other(),
    iconUrl: IconUrl,
    id: Id,
    canBeBase: CanBeBase,
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

export const mapToLevelCell = (lc: any) => {
  const {x, width, y, height} = lc.getClientRect();
  const {order, type} = lc.getAttrs();
  const {parent: {index: parentIndex}, index: cellIndex} = lc;
  return {
    x: {
      start: x - LEFT_PADDING,
      end: x + width - LEFT_PADDING
    },
    y: {
      start: y - TOP_PADDING,
      end: y - TOP_PADDING + height
    },
    order,
    type,
    parentIndex,
    cellIndex
  };
};
