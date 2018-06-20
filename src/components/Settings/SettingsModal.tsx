import * as React from 'react';
import keycodes from '../../constants/keycodes';
import {ModalHeaderTitle} from '../Modal/styles';
import withModal from '../Modal/withModal';
import {Tabs} from '../Tabs';
import {OkButton, SettingsModalContent, StyledSettingsModal} from './styles';
import {ProfileTab, SecurityTab} from './Tabs';

interface SettingsModalProps {
  handleCloseSettings: () => void;
}

class SettingsModal extends React.Component<SettingsModalProps> {
  private handleKeyboardActions: (event: KeyboardEvent) => void;

  constructor(props: SettingsModalProps) {
    super(props);

    this.handleKeyboardActions = (event: KeyboardEvent) => {
      if (event.keyCode === keycodes.ESC) {
        this.handleCancel();
        event.preventDefault();
      }
    };
  }

  componentDidMount() {
    document.body.addEventListener(
      'keydown',
      this.handleKeyboardActions,
      false
    );
  }

  componentWillUnmount() {
    document.body.removeEventListener(
      'keydown',
      this.handleKeyboardActions,
      false
    );
  }

  handleCancel = () => {
    this.props.handleCloseSettings();
  };

  render() {
    return (
      <StyledSettingsModal>
        <ModalHeaderTitle>Settings</ModalHeaderTitle>
        <SettingsModalContent>
          <Tabs>
            <ProfileTab title={'Profile'} />
            <SecurityTab title={'Security'} />
          </Tabs>
        </SettingsModalContent>
        <OkButton type="button" onClick={this.handleCancel}>
          Ok
        </OkButton>
      </StyledSettingsModal>
    );
  }
}

export default withModal(SettingsModal);
