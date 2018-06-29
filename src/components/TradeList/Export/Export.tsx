import * as React from 'react';
import {HistoryResponseModel} from '../../../models';
import {ExportButton} from '../styles';
import saveFile from './exportDataAndSave';

interface ExportProps {
  fetchHistory: () => Promise<HistoryResponseModel[]>;
  canExport: () => boolean;
}

class Export extends React.Component<ExportProps> {
  constructor(props: ExportProps) {
    super(props);
  }

  saveFile = () => {
    saveFile(this.props.fetchHistory);
  };

  render() {
    return (
      <ExportButton
        className={this.props.canExport() ? 'clickable' : ''}
        onClick={this.props.canExport && this.saveFile}
      >
        Export history (csv)
      </ExportButton>
    );
  }
}

export default Export;
