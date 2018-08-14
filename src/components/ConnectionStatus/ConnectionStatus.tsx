import * as React from 'react';
import {StyledConnectionStatus} from './styles';

export interface ConnectionStatusProps {
  getConnectionOpened: () => boolean;
}

const ConnectionStatus: React.SFC<ConnectionStatusProps> = ({
  getConnectionOpened
}) => {
  return (
    <StyledConnectionStatus
      className={getConnectionOpened() ? 'connected' : ''}
    >
      Connection: {getConnectionOpened() ? 'Online' : 'Offline'}
    </StyledConnectionStatus>
  );
};

export default ConnectionStatus;
