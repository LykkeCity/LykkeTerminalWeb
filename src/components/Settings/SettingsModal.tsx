import {ClickOutside} from '@lykkex/react-components';
import * as React from 'react';
import keycodes from '../../constants/keycodes';
import ModalHeader from '../Modal/ModalHeader/ModalHeader';
import withModal from '../Modal/withModal';
import {SettingsModalContent, StyledSettingsModal, StyledTabs} from './styles';
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
      <ClickOutside onClickOutside={this.handleCancel}>
        <StyledSettingsModal>
          <ModalHeader title={'Settings'} onClick={this.handleCancel} />
          <SettingsModalContent>
            <StyledTabs>
              <ProfileTab title={'Profile'} />
              <SecurityTab title={'Security'} />
            </StyledTabs>
          </SettingsModalContent>
        </StyledSettingsModal>
      </ClickOutside>
    );
  }
}

export default withModal(SettingsModal);
