import {action, observable} from 'mobx';
import {BaseStore, RootStore} from './index';

class ApiStore extends BaseStore {
  @observable private useMockData: boolean = false;
  @observable private useCacheData: boolean = false;

  constructor(store: RootStore) {
    super(store);

    this.setUseMockData(process.env.REACT_APP_USE_MOCKS === 'true');
    this.setUseCacheData(process.env.REACT_APP_USE_CACHE === 'true');
  }

  @action
  setUseMockData = (useMockData: boolean) => (this.useMockData = useMockData);
  getUseMockData = () => this.useMockData;

  @action
  setUseCacheData = (useCacheData: boolean) =>
    (this.useCacheData = useCacheData);
  getUseCacheData = () => this.useCacheData;

  reset = () => {
    this.useMockData = false;
    this.useCacheData = false;
  };
}

export default ApiStore;
