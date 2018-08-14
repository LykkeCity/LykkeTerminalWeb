import {observer} from 'mobx-react';
import {connect} from '../connect';
import ConnectionStatus, {ConnectionStatusProps} from './ConnectionStatus';

const ConnectedConnectionStatus = connect<ConnectionStatusProps>(
  ({uiStore}) => ({
    getConnectionOpened: uiStore.getConnectionOpened
  }),
  observer(ConnectionStatus)
);

export {ConnectedConnectionStatus as ConnectionStatus};
