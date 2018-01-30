import * as React from 'react';
import styled from 'styled-components';
import keys from '../../constants/storageKeys';
import ModalModel from '../../models/modalModel';
import {StorageUtils} from '../../utils/index';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox';
import {ConfirmModalProps} from './index';

const confirmStorage = StorageUtils(keys.confirmReminder);

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledModal = styled.div`
  font-family: Proxima Nova;
  position: absolute;
  padding: 20px 25px;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 320px;
  border-radius: 12px;
  background-color: #3c3c3c;
  border: solid 1px rgba(0, 0, 0, 0.2);
  z-index: 3;
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

const Button = styled.button`
  color: #f5f6f7;
  width: 152px;
  height: 49px;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
  }
`;

const ApplyButton = styled(Button)`
  background-color: #0388ef;
  border: solid 1px #0388ef;
`;

const CancelButton = styled(Button)`
  background: transparent;
  border: solid 1px rgba(140, 148, 160, 0.4);
`;

class ConfirmModal extends React.Component<ConfirmModalProps> {
  constructor(props: ConfirmModalProps) {
    super(props);
  }

  handleChange = () => (e: any) => {
    confirmStorage.set(!e.target.checked);
  };

  handleApply = (modal: ModalModel) => () => {
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
        <StyledModal>
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
        </StyledModal>
      </div>
    );
  }
}

export default ConfirmModal;
