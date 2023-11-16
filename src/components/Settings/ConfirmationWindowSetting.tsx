import {Switcher} from '@lykkecity/react-components';
import * as React from 'react';
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
        <Switcher
          onToggle={this.handleConfirm}
          checked={!this.props.confirmations}
          label="Do not warn me on next trades"
        />
      </StyledConfirmationSetting>
    );
  }
}

export default ConfirmationWindowSetting;
