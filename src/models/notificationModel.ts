import timeouts from '../constants/timeouts';

class NotificationModel {
  level: string;
  message: string;
  selfDestroy: any;
  timeoutId: any;

  constructor(level: string, message: string, selfDestroy: any) {
    this.level = level;
    this.message = message;
    this.selfDestroy = selfDestroy;

    this.timeoutId = setTimeout(() => {
      this.selfDestroy(this);
    }, timeouts.notificationClose);
  }

  clearTimeout = () => {
    clearTimeout(this.timeoutId);
  };
}

export default NotificationModel;
