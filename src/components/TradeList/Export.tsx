import * as React from 'react';
import {HistoryResponseModel} from '../../models';
import {ExportButton} from './styles';

interface ExportProps {
  fetchHistory: () => Promise<HistoryResponseModel[]>;
  canExport: any;
}

const extension = '.csv';
const documentType = 'text/csv;charset=utf-8;';

const downloadLink = document.createElement('a');
downloadLink.style.display = 'none';
downloadLink.target = '_blank';
downloadLink.onclick = (event: any) => {
  document.body.removeChild(event.target);
};

class Export extends React.Component<ExportProps> {
  constructor(props: ExportProps) {
    super(props);
  }

  generateId = () => new Date().getTime();

  downloadFile = (objectUrl: string, filename: string) => {
    downloadLink.download = filename;
    downloadLink.href = objectUrl;
    document.body.appendChild(downloadLink);
    downloadLink.click();
  };

  toCsvRow = (record: HistoryResponseModel) => {
    const row = [
      record.DateTime,
      record.Type,
      'Lykke',
      record.Price,
      record.Asset,
      record.Amount,
      record.AssetPair!.replace(record.Asset!, ''),
      record.FeeSize,
      record.FeeType
    ];
    return row.join('\t') + '\r\n';
  };

  exportToCsv = (rawData: HistoryResponseModel[]) => {
    let csv =
      'Date	Type\tExchange\tBase amount\tBase currency\tQuote amount\tQuote currency\tFee\tFee currency\n';
    rawData.forEach(record => {
      csv += this.toCsvRow(record);
    });
    return csv;
  };

  saveFile = async () => {
    const filename = `trades-${this.generateId()}${extension}`;
    const rawData = await this.props.fetchHistory();
    const csv = this.exportToCsv(rawData);
    const dataToSave = new Blob([csv], {type: documentType});
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(dataToSave, filename);
    } else {
      const objectUrl = window.URL.createObjectURL(dataToSave);
      this.downloadFile(objectUrl, filename);
    }
  };

  render() {
    return (
      <ExportButton
        className={this.props.canExport() ? 'clickable' : ''}
        onClick={this.props.canExport() && this.saveFile}
      >
        Export history (csv)
      </ExportButton>
    );
  }
}

export default Export;
