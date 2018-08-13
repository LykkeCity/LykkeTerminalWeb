import {computed} from 'mobx';

export default class UserInfoModel {
  email: string;
  firstName: string;
  lastName: string;
  kycStatus: string;

  @computed
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(userInfo: any) {
    this.email = userInfo.Email;
    this.firstName = userInfo.FirstName;
    this.lastName = userInfo.LastName;
    this.kycStatus = userInfo.KycStatus;
  }
}
