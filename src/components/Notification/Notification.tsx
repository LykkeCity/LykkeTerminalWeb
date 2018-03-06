import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {NotificationProps} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const notificationLevels = {
  Error: '#ff3e2e',
  Information: '#0388ef',
  Success: '#13b72a'
};

const getBackground = (level: string) => {
  return notificationLevels[level];
};

const StyledNotification = styled.div`
  position: relative;
  margin-top: 10px;
  width: 312px;
  border-radius: 6px;
  padding: 12px 16px;
  background-color: ${(p: any) => getBackground(p.level)};
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
` as any;

const StyledCloseBtn = styled.a`
  color: #f5f6f7;
  text-decoration: none;
  cursor: pointer;
  font-size: 16px;
  > span {
    position: absolute;
    top: 2px;
    right: 9px;
  }
`;

const StyledTitle = styled.div`
  width: 39px;
  height: 16px;
  font-family: 'Akrobat';
  font-size: ${rem(20)};
  font-weight: bold;
  line-height: 0.8;
  text-align: left;
`;

const StyledMessage = styled.div`
  font-family: 'Proxima Nova';
  font-size: 12px;
  line-height: 1.14;
  margin-top: 12px;

  &:first-letter {
    text-transform: capitalize;
  }
`;

const Notification: React.SFC<NotificationProps> = ({
  index,
  level,
  message,
  closeNotification
}) => {
  return (
    <StyledNotification level={level} key={index}>
      <Flex justify={'space-between'}>
        <StyledTitle>{level}</StyledTitle>
        <StyledCloseBtn href="#" onClick={closeNotification}>
          <span>&times;</span>
        </StyledCloseBtn>
      </Flex>
      <StyledMessage>{message}</StyledMessage>
    </StyledNotification>
  );
};

export default Notification;
