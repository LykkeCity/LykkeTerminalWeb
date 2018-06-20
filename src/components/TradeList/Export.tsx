import * as React from 'react';
import {ExportButton} from './styles';

interface ExportProps {
  exportHistory: any;
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

  saveFile = async () => {
    const filename = `trades-${this.generateId()}${extension}`;
    const data = await this.props.exportHistory();
    const dataToSave = new Blob([data], {type: documentType});
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(dataToSave, filename);
    } else {
      const objectUrl = window.URL.createObjectURL(dataToSave);
      this.downloadFile(objectUrl, filename);
    }
  };

  render() {
    return (
      <ExportButton className={'clickable'} onClick={this.saveFile}>
        Export history (csv)
      </ExportButton>
    );
  }
}

export default Export;
