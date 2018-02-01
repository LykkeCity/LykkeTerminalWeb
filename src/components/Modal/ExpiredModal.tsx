import * as React from 'react';
import styled from 'styled-components';
import {Button, StyledModal} from './index';

const StyledExpiredModal = styled(StyledModal)`
  width: 300px;
  text-align: center;
`;

const StyledButton = styled(Button)`
  background: transparent;
  border: solid 1px rgba(140, 148, 160, 0.4);
`;

const ExpiredModal: React.SFC = () => {
  return (
    <StyledExpiredModal>
      <div>Please, confirm your session</div>
      <div>
        Your session has expired. Please confirm session with your phone
      </div>
      <StyledButton>Exit</StyledButton>
    </StyledExpiredModal>
  );
};

export default ExpiredModal;
