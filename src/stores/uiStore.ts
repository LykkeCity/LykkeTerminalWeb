import {observable} from 'mobx';

export class UiStore {
  @observable showAssetsSelect: boolean = false;

  readonly toggleAssetsSelect = () =>
    (this.showAssetsSelect = !this.showAssetsSelect);
}

export default UiStore;
