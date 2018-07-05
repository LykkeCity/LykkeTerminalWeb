import {HistoryResponseModel} from '..';

const Types = {
  Buy: 'Buy',
  Sell: 'Sell'
};

const exchange = 'Lykke';
const csvHeader =
  'Date\tType\tExchange\tBase amount\tBase currency\tQuote amount\tQuote currency\tFee\tFee currency\n';

const parseType = (record: HistoryResponseModel): string => {
  if (record.AssetPair) {
    return record.Amount! < 0 ? Types.Sell : Types.Buy;
  } else {
    return record.Type;
  }
};

const parsePriceAsset = (assetPair: string, asset: string) => {
  if (assetPair && asset) {
    return assetPair.replace(asset, '');
  }
  return '';
};

export const generateCsvRow = (record: HistoryResponseModel): string => {
  const isZeroFee = record.FeeSize === 0;
  const type = parseType(record);
  const priceAsset = parsePriceAsset(record.AssetPair!, record.Asset!);
  const row = [
    record.DateTime,
    type,
    exchange,
    Math.abs(record.Amount),
    record.Asset,
    record.Price,
    priceAsset,
    isZeroFee ? '' : record.FeeSize,
    isZeroFee ? '' : record.Asset
  ];
  return row.join('\t') + '\r\n';
};

export const historyToCsv = (history: HistoryResponseModel[]): string => {
  let csv = csvHeader;
  history.forEach(record => {
    csv += generateCsvRow(record);
  });
  return csv;
};
