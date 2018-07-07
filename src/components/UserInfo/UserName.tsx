import * as React from 'react';
import UserInfoModel from '../../models/userInfoModel';
import {StyledUserName} from './styles';

interface UserNameProps {
  getUserInfo: () => UserInfoModel | null;
}

const UserName: React.SFC<UserNameProps> = ({getUserInfo}) => {
  const userInfo = getUserInfo();

  if (!userInfo) {
    return null;
  }

  return <StyledUserName>{getUserInfo()!.fullName}</StyledUserName>;
};

export default UserName;
