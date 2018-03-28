import {rem} from 'polished';
import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

export const SessionNotificationBlock = styled.div`
  position: absolute;
  z-index: 7;
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
  margin-top: ${rem(8)};
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
  margin-top: ${rem(14)};
`;

export const Timer = styled.span`
  font-family: Akrobat;
  font-size: ${rem(20)};
  font-weight: bold;
  line-height: 0.8;
  color: #f5f6f7;
`;

export const Buttons = styled(Flex)`
  margin-top: ${rem(22)};
  font-size: ${rem(14)};
`;

export const ExtendSessionButton = styled.div`
  border-radius: ${rem(4)};
  border: solid 1px rgba(255, 255, 255, 0.4);
  line-height: 1.14;
  text-align: center;
  color: #f5f6f7;
  width: ${rem(144)};
  height: ${rem(32)};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

export const SettingsButton = styled.div`
  margin-left: ${rem(20)};
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

export const Note = styled.div`
  margin-top: ${rem(10)};
  font-family: ProximaNova, sans-serif;
  font-size: ${rem(12)};
  line-height: 1.33;
  color: #ffffff;
`;

export const NoteMark = styled.span`
  display: inline-block;
  border-radius: 50%;
  width: ${rem(16)};
  height: ${rem(16)};
  background-color: #fff;
  opacity: 0.4;
  color: #ff3e2e;
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

export const SessionDurations = styled(Flex)`
  margin-top: ${rem(19)};
`;

export const CloseBtnPosition = {
  top: 5,
  right: 25
};
