import * as React from 'react';
import {keys} from '../../models';
import ModalModel from '../../models/modalModel';
import {StorageUtils} from '../../utils/index';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox';
import ModalHeader from './ModalHeader/ModalHeader';
import {
  ApplyButton,
  CancelButton,
  Modal,
  ModalContent,
  ModalReminder
} from './styles';

interface ConfirmModalProps {
  modal: ModalModel;
}

const confirmStorage = StorageUtils(keys.confirmReminder);

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

interface ConfirmModalState {
  isReminderChecked: boolean;
}

class ConfirmModal extends React.Component<
  ConfirmModalProps,
  ConfirmModalState
> {
  constructor(props: ConfirmModalProps) {
    super(props);
    this.state = {
      isReminderChecked: !JSON.parse(confirmStorage.get() || 'true')
    };
  }

  handleChange = () => (e: any) => {
    this.setState({
      isReminderChecked: e.target.checked
    });
  };

  handleApply = (modal: ModalModel) => () => {
    confirmStorage.set(!this.state.isReminderChecked);

    modal.applyAction();
    modal.close();
  };

  handleCancel = (modal: ModalModel) => () => {
    modal.cancelAction();
    modal.close();
  };

  render() {
    const {modal} = this.props;
    return (
      <div>
        <Modal>
          <ModalHeader title={'Confirm'} onClick={this.handleCancel(modal)} />
          <ModalContent>Do you really want to {modal.message}?</ModalContent>
          <ModalReminder>
            <CustomCheckbox
              change={this.handleChange()}
              label={`Don't ask me again`}
              checked={this.state.isReminderChecked}
            />
          </ModalReminder>
          <Flex justify={'space-between'} style={{marginTop: '24px'}}>
            <ApplyButton type="button" onClick={this.handleApply(modal)}>
              Yes
            </ApplyButton>
            <CancelButton type="button" onClick={this.handleCancel(modal)}>
              Cancel
            </CancelButton>
          </Flex>
        </Modal>
      </div>
    );
  }
}

export default ConfirmModal;
