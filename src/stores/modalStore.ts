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
    message: string,
    applyAction: any,
    cancelAction: any,
    type: string
  ) => {
    const modal = new ModalModel(
      message,
      applyAction,
      cancelAction,
      (m: ModalModel) => this.closeModal(m),
      type
    );
    this.modals = [...this.modals, ...[modal]];
  };

  closeModal = (modal: ModalModel) => {
    const index = this.modals.indexOf(modal);
    this.modals.splice(index, 1);
  };

  reset = () => {
    return;
  };
}

export default ModalStore;
