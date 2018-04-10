import {keys} from '../models';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface SessionApi {
  saveSessionNoteShown: (currentDate: any) => ApiResponse;
  loadSessionNoteShown: ApiResponse;
  getQRConfirmation: () => ApiResponse;
  getSessionStatus: () => ApiResponse;
  getSessionStatusMock: () => ApiResponse;
}

export class RestSessionApi extends RestApi implements SessionApi {
  saveSessionNoteShown = (currentDate: any) =>
    this.fireAndForget(`/dictionary/${keys.sessionNote}`, currentDate);
  loadSessionNoteShown = () => this.get(`/dictionary/${keys.sessionNote}`);
  getQRConfirmation = () => this.get(`/getlykkewallettoken`);
  getSessionStatus = () => this.get(`/client/features`);
  getSessionStatusMock = () =>
    Promise.resolve({terminal: {enabled: true, ttl: 100000}});
}

// tslint:disable-next-line:max-classes-per-file
export class MockSessionApi implements SessionApi {
  saveSessionNoteShown = () => Promise.resolve();
  loadSessionNoteShown = () => Promise.resolve();
  getQRConfirmation = () => Promise.resolve();
  getSessionStatus = () => Promise.resolve();
  getSessionStatusMock = () => Promise.resolve();
}

export default RestSessionApi;
