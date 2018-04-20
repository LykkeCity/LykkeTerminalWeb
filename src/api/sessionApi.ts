import {keys} from '../models';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface SessionApi {
  saveSessionNoteShown: (currentDate: any) => ApiResponse;
  loadSessionNoteShown: ApiResponse;
  saveSessionDuration: (duration: number) => ApiResponse;
  getSessionDuration: () => {};
  getSessionStatus: () => ApiResponse;
  extendSession: (Ttl: number) => ApiResponse;
  createSession: (Ttl: number) => ApiResponse;
}

export class RestSessionApi extends RestApi implements SessionApi {
  saveSessionNoteShown = (currentDate: any) =>
    this.fireAndForget(`/dictionary/${keys.sessionNote}`, currentDate);
  loadSessionNoteShown = () => this.get(`/dictionary/${keys.sessionNote}`);
  getSessionStatus = () => this.get(`/client/features`);
  extendSession = (Ttl: number) => this.patch('/client/session', {Ttl});
  createSession = (Ttl: number) => this.fireAndForget('/client/session', {Ttl});
  saveSessionDuration = (duration: number) =>
    this.fireAndForget(`/dictionary/${keys.sessionDuration}`, {Data: duration});
  getSessionDuration = () => this.get(`/dictionary/${keys.sessionDuration}`);
}

// tslint:disable-next-line:max-classes-per-file
export class MockSessionApi implements SessionApi {
  saveSessionNoteShown = () => Promise.resolve();
  loadSessionNoteShown = () => Promise.resolve();
  saveSessionDuration = () => Promise.resolve();
  getSessionDuration = () => Promise.resolve();
  getSessionStatus = () => Promise.resolve();
  extendSession = () => Promise.resolve();
  createSession = () => Promise.resolve();
}

export default RestSessionApi;
