import {keys} from '../models';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface SessionApi {
  saveSessionNoteShown: (currentDate: any) => ApiResponse;
  loadSessionNoteShown: ApiResponse;
  getQRConfirmation: (id: string) => ApiResponse;
}

export class RestSessionApi extends RestApi implements SessionApi {
  saveSessionNoteShown = (currentDate: any) =>
    this.fireAndForget(`/dictionary/${keys.sessionNote}`, currentDate);
  loadSessionNoteShown = () => this.get(`/dictionary/${keys.sessionNote}`);
  getQRConfirmation = (id: string) => this.get(`/operations/${id}`);
}

// tslint:disable-next-line:max-classes-per-file
export class MockSessionApi implements SessionApi {
  saveSessionNoteShown = () => Promise.resolve();
  loadSessionNoteShown = () => Promise.resolve();
  getQRConfirmation = () => Promise.resolve();
}

export default RestSessionApi;
