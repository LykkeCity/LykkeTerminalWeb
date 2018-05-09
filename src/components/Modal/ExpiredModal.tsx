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
      {/* tslint:disable-next-line:jsx-no-lambda */}
      <StyledButton onClick={() => location.reload()}>Turn on 2FA</StyledButton>
    </Expired>
  );
};

export default ExpiredModal;
