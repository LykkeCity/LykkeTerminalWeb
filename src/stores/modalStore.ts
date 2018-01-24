import {observable} from 'mobx';
import {BaseStore, RootStore} from './index';

class ModalStore extends BaseStore {
  @observable showConfirmModal: boolean = false;
  message: string = '';
  applyAction: any;
  cancelAction: any;

  constructor(store: RootStore) {
    super(store);
  }

  addConfirmModal = (message: string, applyAction: any, cancelAction: any) => {
    this.showConfirmModal = true;
    this.applyAction = applyAction;
    this.cancelAction = cancelAction;
    this.message = message;
  };

  closeConfirmModal = () => {
    this.showConfirmModal = false;
  };

  reset = () => {
    return;
  };
}

export default ModalStore;
