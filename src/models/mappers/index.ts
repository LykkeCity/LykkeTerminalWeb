import {ChartStore} from '../../stores/index';
import {InstrumentModel, Side} from '../index';

// tslint:disable:object-literal-sort-keys

export const mapToOrder = (dto: any) => ({
  id: dto.Id,
  price: dto.Price,
  side: dto.IsBuy ? Side.Sell : Side.Buy,
  timestamp: dto.DateTime,
  volume: dto.Volume
});

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
  invertedAccuracy
}: InstrumentModel) => ({
  name,
  minmov: 1,
  pricescale: 1,
  session: '24x7',
  timezone: 'Europe/Istanbul',
  supported_resolutions: ChartStore.config.supported_resolutions,
  has_intraday: true,
  intraday_multipliers: ['1', '5', '15', '30', '60', '240', '360', '720'],
  has_empty_bars: true
});
