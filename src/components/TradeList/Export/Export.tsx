import * as React from 'react';
import {UserInfoModel} from '../../../models';
import {ExportButton} from '../styles';
import saveFile from './saveFileByUrl';

import {Feature, FeatureFlag, LaunchDarkly} from '../../../utils/launchDarkly';

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
      <LaunchDarkly
        clientId={process.env.REACT_APP_LAUNCH_DARKLY_CLIENT_ID}
        user={{key: this.props.userInfo.email}}
      >
        <FeatureFlag
          flagKey={Feature.ExportTradingHistory}
          // tslint:disable-next-line:jsx-no-lambda
          renderFeatureCallback={() => (
            <ExportButton
              className={this.props.canExport() ? 'clickable' : ''}
              onClick={this.saveFile}
            >
              Export trades (csv)
            </ExportButton>
          )}
        />
      </LaunchDarkly>
    );
  }
}

export default Export;
