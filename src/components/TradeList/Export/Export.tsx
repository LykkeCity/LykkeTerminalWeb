import * as React from 'react';
import {UserInfoModel} from '../../../models';
import {ExportButton} from '../styles';
import saveFile from './saveFileByUrl';

interface ExportProps {
  fetchCsvUrl: () => Promise<string>;
  canExport: () => boolean;
  userInfo: UserInfoModel;
}

class Export extends React.Component<ExportProps> {
  constructor(props: ExportProps) {
    super(props);
  }

  saveFile = () => {
    if (this.props.canExport()) {
      saveFile(this.props.fetchCsvUrl);
    }
  };

  render() {
    return (
      <ExportButton
        className={this.props.canExport() ? 'clickable' : ''}
        onClick={this.saveFile}
      >
        Export trades (csv)
      </ExportButton>
    );
  }
}

export default Export;
