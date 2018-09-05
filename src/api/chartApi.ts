import mockChartApi from '../api/mocks/chartApi';
import {keys} from '../models';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface ChartApi {
  save: (body: any, key: string) => ApiResponse;
  load: (key: string) => ApiResponse;
  reset: () => ApiResponse;
}

export class RestChartApi extends RestApi implements ChartApi {
  save = (body: any) =>
    this.extendWithMocks(
      () => this.fireAndForget(`/dictionary/${keys.chartKey}`, body),
      () => mockChartApi.save(body)
    );

  load = () =>
    this.extendWithMocks(
      () => this.get(`/dictionary/${keys.chartKey}`),
      () => mockChartApi.load()
    );

  reset = () =>
    this.extendWithMocks(
      () => this.delete(`/dictionary/${keys.chartKey}`),
      () => mockChartApi.reset()
    );
}

export default RestChartApi;
