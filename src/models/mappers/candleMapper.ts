import {timeParse} from 'd3-time-format';
import {
  ChartCandleModel,
  ChartCandleResponseModel,
  ChartCandleWampResponseModel
} from '..';

const parseDate = timeParse('%Y-%m-%dT%H:%M:%SZ');

export const mapToChartCandleModel = ({
  High,
  Low,
  Open,
  Close,
  Volume,
  DateTime,
  AbsoluteChange,
  PercentChange,
  Dividend,
  Split
}: ChartCandleResponseModel) =>
  new ChartCandleModel({
    high: High,
    low: Low,
    open: Open,
    close: Close,
    volume: Volume,
    date: parseDate(DateTime),
    absoluteChange: AbsoluteChange,
    percentChange: PercentChange,
    dividend: Dividend || '',
    split: Split || ''
  });

export const mapToChartCandleModelFromWamp = ({
  c,
  h,
  l,
  o,
  t,
  v
}: ChartCandleWampResponseModel) =>
  new ChartCandleModel({
    high: h,
    low: l,
    open: o,
    close: c,
    volume: v,
    date: parseDate(t)
  });
