import * as React from 'react';
import styled from 'styled-components';
import ClickOutside from '../ClickOutside/ClickOutside';
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
  width: 312px;
  border-radius: 6px;
  padding: 16px;
  background-color: ${(p: any) => getBackground(p.level)};
  position: absolute;
  right: 15px;
  top: 30px;
  z-index: 999;
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
` as any;

const StyledCloseBtn = styled.a`
  color: #f5f6f7;
  text-decoration: none;
  cursor: pointer;
  font-size: 18px;
`;

const StyledTitle = styled.div`
  width: 39px;
  height: 16px;
  font-size: 20px;
  font-weight: bold;
  line-height: 0.8;
`;

const StyledMessage = styled.div`
  font-family: Proxima Nova;
  font-size: 14px;
  line-height: 1.14;
  margin-top: 5px;
`;

class Notification extends React.Component<NotificationProps> {
  constructor(props: NotificationProps) {
    super(props);
  }

  closeHandler = () => {
    this.props.closeNotification();
  };

  render() {
    const {showNotification, level} = this.props;
    return (
      <ClickOutside onClickOutside={this.props.closeNotification}>
        <div>
          {showNotification ? (
            <StyledNotification level={level}>
              <Flex justify={'space-between'}>
                <StyledTitle>{this.props.level}</StyledTitle>
                <StyledCloseBtn href="#" onClick={this.closeHandler}>
                  &times;
                </StyledCloseBtn>
              </Flex>
              <StyledMessage>{this.props.message}</StyledMessage>
            </StyledNotification>
          ) : null}
        </div>
      </ClickOutside>
    );
  }
}

export default Notification;
