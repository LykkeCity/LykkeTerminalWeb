import * as React from 'react';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox';
import {StyledConfirmationSetting} from './styles';

interface ConfirmationWindowSettingProps {
  toggleConfirmations: () => void;
  confirmations: boolean;
}

class ConfirmationWindowSetting extends React.Component<
  ConfirmationWindowSettingProps
> {
  constructor(props: ConfirmationWindowSettingProps) {
    super(props);
  }

  handleConfirm = () => {
    this.props.toggleConfirmations();
  };

  render() {
    return (
      <StyledConfirmationSetting>
        <CustomCheckbox
          change={this.handleConfirm}
          checked={this.props.confirmations}
          label={`Warn me on next trades`}
        />
      </StyledConfirmationSetting>
    );
  }
}

export default ConfirmationWindowSetting;
