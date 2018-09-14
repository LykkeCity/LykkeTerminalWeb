import {IConnectionOptions} from 'autobahn';
import {Session} from './session';

type OnOpenCallback = (session: Session, details: any) => void;
type OnCloseCallback = (reason?: string, message?: string) => boolean;

export class Connection {
  set onopen(fn: OnOpenCallback) {
    this.onOpen = fn;
  }

  get onopen(): OnOpenCallback {
    return this.onOpen;
  }

  set onclose(fn: OnCloseCallback) {
    this.onClose = fn;
  }

  get onclose(): OnCloseCallback {
    return this.onClose;
  }

  isConnectionOpened: boolean = false;

  private realm: any;
  private onOpen: OnOpenCallback;
  private onClose: OnCloseCallback;

  constructor(options: IConnectionOptions = {}) {
    this.realm = options.realm;
  }

  open(): void {
    const session: Session = new Session();
    session.realm = this.realm;
    this.isConnectionOpened = true;

    if (this.onOpen) {
      this.onOpen(session, null);
    }
  }

  close(reason?: string, message?: string): void {
    this.isConnectionOpened = false;

    if (this.onClose) {
      this.onClose(reason, message);
    }
  }
}
