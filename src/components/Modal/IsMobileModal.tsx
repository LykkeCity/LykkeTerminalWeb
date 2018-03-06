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

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  div {
    margin: 0;
  }
`;

const StyledTitle = styled.div`
  font-size: ${rem(20)};
  font-weight: 600;
`;

const StyledBody = styled.div`
  line-height: 1.5;
  text-align: left;
`;

const StyledButton = styled(Button)`
  margin: 20px 0 0 0;
  padding: 16px 0;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  background-color: #0388ef;
  border: none;
`;

const StyledLink = styled.a.attrs({
  style: (props: any) => ({
    backgroundImage: `url('assets/images/${props.image}.svg')`
  })
})`
  width: 45%;
  height: 40px;
  background: no-repeat center;
  background-size: cover;
  margin: 20px 0 0 0;
  text-decoration: none;
` as any;

const IsMobileModal: React.SFC<{modal: ModalModel}> = ({modal}) => {
  const openApp = () => {
    location.replace(modal.message.mobileApp);

    setTimeout(() => location.replace(modal.message.link), 500);
  };

  return (
    <StyledExpiredModal>
      <Wrapper style={{marginTop: 0}}>
        <StyledTitle>{modal.message.title}</StyledTitle>
        <div onClick={modal.close}>X</div>
      </Wrapper>
      <StyledBody>{modal.message.body}</StyledBody>
      {typeof modal.message.link === 'string' ? (
        <StyledButton onClick={openApp}>Go to Lykke Wallet</StyledButton>
      ) : (
        <Wrapper>
          <StyledLink href={modal.message.link.appStore} image={'app-store'} />
          <StyledLink
            href={modal.message.link.playMarket}
            image={'google-play'}
          />
        </Wrapper>
      )}
    </StyledExpiredModal>
  );
};

export default IsMobileModal;
