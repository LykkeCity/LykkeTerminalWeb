import {RestApi} from './restApi';

export interface SessionApi {
  sendSession: any;
}

export class RestSessionApi extends RestApi implements SessionApi {
  sendSession = () => {
    return;
  };
}

// tslint:disable-next-line:max-classes-per-file
export class MockSessionApi implements SessionApi {
  sendSession = () => {
    return;
  };
}

export default RestSessionApi;
