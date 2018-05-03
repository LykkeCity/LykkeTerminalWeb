import {rem} from 'polished';
import styled from 'styled-components';
import {colors} from '../styled';

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
  box-shadow: 0 10px 10px 0 ${colors.darkGraphite};
  padding: ${rem(24)} ${rem(16)} ${rem(16)};
  position: relative;
`;

export const SessionNotification = styled(SessionPopup)`
  background-color: ${colors.red};
`;

export const ReadOnlyModeNotification = styled(SessionPopup)`
  background-color: ${colors.blue};
`;

export const SessionSettings = styled(SessionPopup)`
  margin-top: ${rem(8)};
  background-color: ${colors.grey};
`;

export const Title = styled.div`
  font-family: Akrobat;
  font-size: ${rem(20)};
  font-weight: bold;
  line-height: 0.8;
  color: ${colors.white};
`;

export const Body = styled.div`
  font-size: ${rem(16)};
  color: ${colors.white};
  margin-top: ${rem(14)};
`;

export const Timer = styled.span`
  font-family: Akrobat;
  font-size: ${rem(20)};
  font-weight: bold;
  line-height: 0.8;
  color: ${colors.white};
`;

export const Buttons = styled(Flex)`
  margin-top: ${rem(22)};
  font-size: ${rem(14)};
`;

export const ActionSessionButton = styled.div`
  border-radius: ${rem(4)};
  border: solid 1px ${colors.lightWhite};
  line-height: 1.14;
  text-align: center;
  color: ${colors.white};
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
  color: ${colors.white};
`;

export const NoteMark = styled.span`
  display: inline-block;
  border-radius: 50%;
  width: ${rem(16)};
  height: ${rem(16)};
  background-color: ${colors.white};
  opacity: 0.4;
  color: ${colors.red};
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
