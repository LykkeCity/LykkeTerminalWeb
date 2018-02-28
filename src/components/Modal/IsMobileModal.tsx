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
  padding: 16px 0;
`;

const StyledBody = styled.div`
  line-height: 1.5;
`;

const StyledTitle = styled.div`
  font-size: ${rem(20)};
  font-weight: 600;
`;

const StyledImage = styled.div.attrs({
  style: (props: any) => ({
    backgroundImage: `url(assets/images/${props.image}.svg)`
  })
})`
  height: 100px;
  background: no-repeat center;
` as any;

const IsMobileModal: React.SFC<{modal: ModalModel}> = ({modal}) => {
  return (
    <StyledExpiredModal>
      <StyledTitle>{modal.message.title}</StyledTitle>
      <StyledBody>{modal.message.body}</StyledBody>
      <a href={modal.message.link}>
        <StyledImage image={modal.message.image} />
      </a>
      <StyledButton onClick={modal.close}>OK</StyledButton>
    </StyledExpiredModal>
  );
};

export default IsMobileModal;
