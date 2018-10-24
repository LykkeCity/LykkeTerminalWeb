import {computed, observable} from 'mobx';
import ModalModel from '../models/modalModel';
import {BaseStore, RootStore} from './index';

class ModalStore extends BaseStore {
  @computed
  get isModals() {
    return !!this.modals.length;
  }

  @observable modals: ModalModel[] = [];

  constructor(store: RootStore) {
    super(store);
  }

  addModal = (
    message: any,
    applyAction: any,
    cancelAction: any,
    type: string,
    config?: any
  ) => {
    const modal = new ModalModel(
      message,
      applyAction,
      cancelAction,
      (m: ModalModel) => this.closeModal(m),
      type,
      config
    );
    this.modals.push(modal);
    return modal;
  };

  closeModal = (modal: ModalModel) => {
    const index = this.modals.indexOf(modal);
    this.modals.splice(index, 1);
  };

  reset = () => {
    this.modals = [];
  };
}

export default ModalStore;
