import timeouts from '../constants/timeouts';

class NotificationModel {
  level: string;
  message: string;
  selfDestroy: any;

  constructor(level: string, message: string, selfDestroy: any) {
    this.level = level;
    this.message = message;
    this.selfDestroy = selfDestroy;

    setTimeout(() => {
      this.selfDestroy(this);
    }, timeouts.notificationClose);
  }
}

export default NotificationModel;
