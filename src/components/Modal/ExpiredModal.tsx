import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import ModalModel from '../../models/modalModel';
import {Button, StyledModal} from './index';

const StyledExpiredModal = styled(StyledModal)`
  width: 300px;
  text-align: center;
  div {
    margin-top: 15px;
  }
`;

const StyledButton = styled(Button)`
  background: transparent;
  border: solid 1px rgba(140, 148, 160, 0.4);
  margin: 20px 0 5px 0;
`;

const StyledBody = styled.div`
  line-height: 1.5;
`;

const StyledTitle = styled.div`
  font-size: ${rem(20)};
  font-weight: 600;
`;

const StyledImage = styled.div`
  background: url('assets/images/session_confirm.png') no-repeat center;
  height: 200px;
`;

const ExpiredModal: React.SFC<{modal: ModalModel}> = ({modal}) => {
  return (
    <StyledExpiredModal>
      <StyledImage />
      <StyledTitle>{modal.message.title}</StyledTitle>
      <StyledBody>{modal.message.body}</StyledBody>
      <StyledButton onClick={modal.close}>Exit</StyledButton>
    </StyledExpiredModal>
  );
};

export default ExpiredModal;
