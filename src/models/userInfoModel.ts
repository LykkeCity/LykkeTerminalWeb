import {computed} from 'mobx';

export default class UserInfoModel {
  firstName: string;
  lastName: string;

  @computed
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(userInfo: any) {
    this.firstName = userInfo.FirstName;
    this.lastName = userInfo.LastName;
  }
}
