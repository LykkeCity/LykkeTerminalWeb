import {HistoryResponseModel} from '../../../models';

const Types = {
  Buy: 'Buy',
  Sell: 'Sell'
};

const exchange = 'Lykke';
const extension = '.csv';
const documentType = 'text/csv;charset=utf-8;';
const csvHeader =
  'Date\tType\tExchange\tBase amount\tBase currency\tQuote amount\tQuote currency\tFee\tFee currency\n';

const downloadLink = document.createElement('a');
downloadLink.style.display = 'none';
downloadLink.target = '_blank';
downloadLink.onclick = (event: any) => {
  document.body.removeChild(event.target);
};

const generateId = () => new Date().getTime();

const downloadFile = (objectUrl: string, filename: string) => {
  downloadLink.download = filename;
  downloadLink.href = objectUrl;
  document.body.appendChild(downloadLink);
  downloadLink.click();
};

const generateCsvRow = (record: HistoryResponseModel) => {
  const isZeroFee = record.FeeSize === 0;
  const type = record.Amount! < 0 ? Types.Sell : Types.Buy;
  const row = [
    record.DateTime,
    type,
    exchange,
    Math.abs(record.Amount),
    record.Asset,
    record.Price,
    record.AssetPair!.replace(record.Asset!, ''),
    isZeroFee ? '' : record.FeeSize,
    isZeroFee ? '' : record.Asset
  ];
  return row.join('\t') + '\r\n';
};

const mapToCsv = (rawData: HistoryResponseModel[]) => {
  let csv = csvHeader;
  rawData.forEach(record => {
    csv += generateCsvRow(record);
  });
  return csv;
};

const saveFile = async (
  fetchHistory: () => Promise<HistoryResponseModel[]>
) => {
  const rawData = await fetchHistory();
  const filename = `trades-${generateId()}${extension}`;
  const dataToSave = new Blob([mapToCsv(rawData)], {type: documentType});
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(dataToSave, filename);
  } else {
    const objectUrl = window.URL.createObjectURL(dataToSave);
    downloadFile(objectUrl, filename);
  }
};

export default saveFile;
