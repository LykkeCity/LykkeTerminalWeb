import {rem} from 'polished';
import styled from 'styled-components';

export const SessionNotificationBlock = styled.div`
  position: absolute;
  z-index: 1;
  bottom: ${rem(16)};
  right: ${rem(16)};
`;

const SessionPopup = styled.div`
  width: 304px;
  border-radius: ${rem(6)};
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
  padding: ${rem(24)} ${rem(16)} ${rem(16)};
  position: relative;
`;

export const SessionNotification = styled(SessionPopup)`
  background-color: #ff3e2e;
`;

export const SessionSettings = styled(SessionPopup)`
  background-color: #3c3c3c;
`;

export const Title = styled.div`
  font-family: Akrobat;
  font-size: ${rem(20)};
  font-weight: bold;
  line-height: 0.8;
  color: #f5f6f7;
`;

export const Body = styled.div`
  font-size: ${rem(16)};
  color: #ffffff;
`;

export const Timer = styled.span`
  font-family: Akrobat;
  font-size: ${rem(20)};
  font-weight: bold;
  line-height: 0.8;
  color: #f5f6f7;
`;

export const Button = styled.div`
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.4);
  font-size: ${rem(14)};
  line-height: 1.14;
  text-align: center;
  color: #f5f6f7;
`;

export const CloseBtnPosition = {
  top: 5,
  right: 25
};
