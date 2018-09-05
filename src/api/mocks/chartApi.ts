import {ChartApi} from '../chartApi';

export class MockChartApi implements ChartApi {
  load = () => Promise.resolve([]);
  save = (body: any) => Promise.resolve([]);
  reset = () => Promise.resolve();
}

export default new MockChartApi();
