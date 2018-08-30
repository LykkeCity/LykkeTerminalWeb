import rem from 'polished/lib/helpers/rem';
import styled from 'styled-components';
import {NotificationColor} from '../../models';
import {colors} from '../styled';

const getBackground = (level: string) => {
  return NotificationColor[level];
};

export const StyledNotificationList = styled.div`
  position: absolute;
  right: 15px;
  top: -45px;
  z-index: 999;
`;

export const StyledNotification = styled.div`
  position: relative;
  margin-top: 10px;
  width: 312px;
  border-radius: 6px;
  padding: 12px 16px;
  background-color: ${(p: any) => getBackground(p.level)};
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
`;

export const NotificationCloseButton = styled.a`
  color: ${colors.whiteText};
  text-decoration: none;
  cursor: pointer;
  font-size: 16px;
  > span {
    position: absolute;
    top: 2px;
    right: 9px;
  }
`;

export const NotificationTitle = styled.div`
  width: 39px;
  height: 16px;
  font-family: 'Akrobat';
  font-size: ${rem(20)};
  font-weight: bold;
  line-height: 0.8;
  text-align: left;
`;

export const NotificationMessage = styled.div`
  font-family: 'Proxima Nova';
  font-size: 12px;
  line-height: 1.14;
  margin-top: 12px;

  &:first-letter {
    text-transform: capitalize;
  }
`;
