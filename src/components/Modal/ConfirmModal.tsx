import * as React from 'react';
import styled from 'styled-components';
import keys from '../../constants/storageKeys';
import ModalModel from '../../models/modalModel';
import {StorageUtils} from '../../utils/index';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox';
import {Button, ConfirmModalProps, StyledModal} from './index';

const confirmStorage = StorageUtils(keys.confirmReminder);

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledConfirmModal = styled(StyledModal)`
  width: 320px;
`;

const StyledCloseBtn = styled.a`
  color: #f5f6f7;
  text-decoration: none;
  cursor: pointer;
  font-size: 16px;

  > span {
    position: absolute;
    top: 5px;
    right: 25px;
  }
`;

const StyledTitle = styled.div`
  width: 60px;
  height: 16px;
  font-size: 18px;
  font-weight: bold;
  line-height: 0.8;
`;

const StyledContent = styled.div`
  margin-top: 16px;
  width: 312px;
  height: 48px;
  font-size: 14px;
  line-height: 1.5;
`;

const StyledReminder = styled.div`
  font-size: 14px;
  line-height: 1.5;
  margin-top: 16px;
`;

const ApplyButton = styled(Button)`
  background-color: #0388ef;
  border: solid 1px #0388ef;
`;

const CancelButton = styled(Button)`
  background: transparent;
  border: solid 1px rgba(140, 148, 160, 0.4);
`;

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
      isReminderChecked: true
    };
  }

  handleChange = () => (e: any) => {
    this.setState({
      isReminderChecked: !e.target.checked
    });
  };

  handleApply = (modal: ModalModel) => () => {
    if (!this.state.isReminderChecked) {
      confirmStorage.set(this.state.isReminderChecked);
    }

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
        <StyledConfirmModal>
          <Flex justify={'space-between'}>
            <StyledTitle>Confirm</StyledTitle>
            <StyledCloseBtn href="#" onClick={this.handleCancel(modal)}>
              <span>&times;</span>
            </StyledCloseBtn>
          </Flex>
          <StyledContent>Are you really want to {modal.message}?</StyledContent>
          <StyledReminder>
            <CustomCheckbox
              change={this.handleChange()}
              label={`Don't ask me again`}
            />
          </StyledReminder>
          <Flex justify={'space-between'} style={{marginTop: '24px'}}>
            <ApplyButton type="button" onClick={this.handleApply(modal)}>
              Yes
            </ApplyButton>
            <CancelButton type="button" onClick={this.handleCancel(modal)}>
              Cancel
            </CancelButton>
          </Flex>
        </StyledConfirmModal>
      </div>
    );
  }
}

export default ConfirmModal;
