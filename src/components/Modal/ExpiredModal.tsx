import * as React from 'react';
import ModalModel from '../../models/modalModel';
import {
  Expired,
  ModalBody,
  ModalTitle,
  SessionExpiredImage,
  StyledButton
} from './styles';

const ExpiredModal: React.SFC<{modal: ModalModel}> = ({modal}) => {
  return (
    <Expired>
      <SessionExpiredImage />
      <ModalTitle>{modal.message.title}</ModalTitle>
      <ModalBody>{modal.message.body}</ModalBody>
      <StyledButton onClick={modal.close}>Exit</StyledButton>
    </Expired>
  );
};

export default ExpiredModal;
