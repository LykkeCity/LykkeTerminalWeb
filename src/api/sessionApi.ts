import {keys} from '../models';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface SessionApi {
  saveSessionNoteShown: (currentDate: any) => ApiResponse;
  loadSessionNoteShown: ApiResponse;
  getQrId: () => ApiResponse;
  getSessionStatus: () => ApiResponse;
  getSessionStatusMock: (enabled: boolean, ttl: number) => ApiResponse;
}

export class RestSessionApi extends RestApi implements SessionApi {
  saveSessionNoteShown = (currentDate: any) =>
    this.fireAndForget(`/dictionary/${keys.sessionNote}`, currentDate);
  loadSessionNoteShown = () => this.get(`/dictionary/${keys.sessionNote}`);
  getQrId = () => this.get(`/getlykkewallettoken`);
  getSessionStatus = () => this.get(`/client/features`);
  getSessionStatusMock = (enabled: boolean, ttl: number) =>
    Promise.resolve({terminal: {enabled, ttl}});
}

// tslint:disable-next-line:max-classes-per-file
export class MockSessionApi implements SessionApi {
  saveSessionNoteShown = () => Promise.resolve();
  loadSessionNoteShown = () => Promise.resolve();
  getQrId = () => Promise.resolve();
  getSessionStatus = () => Promise.resolve();
  getSessionStatusMock = () => Promise.resolve();
}

export default RestSessionApi;
