import {connect} from '../connect';
import UserName from './UserName';

const connectedUserName = connect(
  ({uiStore: {getUserInfo}}) => ({
    getUserInfo
  }),
  UserName
);

export {connectedUserName as UserName};
