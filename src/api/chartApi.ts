import keys from '../constants/storageKeys';
import {RestApi} from './restApi';

export interface ChartApi {
  save: (body: any, key: string) => Promise<any>;
  load: (key: string) => Promise<any>;
  reset: () => Promise<any>;
}

export class RestChartApi extends RestApi implements ChartApi {
  save = (body: any) =>
    this.fireAndForget(`/dictionary/${keys.chartKey}`, body);
  load = () => this.get(`/dictionary/${keys.chartKey}`);
  reset = () => this.delete(`/dictionary/${keys.chartKey}`);
}

// tslint:disable-next-line:max-classes-per-file
export class MockChartApi implements ChartApi {
  load = () => Promise.resolve([]);
  save = (body: any) => Promise.resolve([]);
  reset = () => Promise.resolve();
}

export default RestChartApi;
