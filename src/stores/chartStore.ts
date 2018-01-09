import {WampApi} from '../api';
import startChart from '../chart';

class ChartStore {
  updateChart(instrumentId: string) {
    startChart(WampApi.currentSession, instrumentId);
  }
}

export default ChartStore;
