import UserInfoModel from '../userInfoModel';

export interface ApiUserInfoModel {
  [key: string]: any;
}

export const toUserInfoModel = (dto: ApiUserInfoModel) => {
  return new UserInfoModel(dto);
};
