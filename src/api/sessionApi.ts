import mockSessionApi from '../api/mocks/sessionApi';
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
    this.extendForOffline(
      () => this.fireAndForget(`/dictionary/${keys.sessionNote}`, currentDate),
      () => mockSessionApi.saveSessionDuration(currentDate)
    );

  loadSessionNoteShown = () =>
    this.extendForOffline(
      () => this.get(`/dictionary/${keys.sessionNote}`),
      () => mockSessionApi.loadSessionNoteShown()
    );

  getSessionStatus = () =>
    this.extendForOffline(
      () => this.get(`/client/features`),
      () => mockSessionApi.getSessionStatus()
    );

  extendSession = (Ttl: number) =>
    this.extendForOffline(
      () => this.patch('/client/session', {Ttl}),
      () => mockSessionApi.extendSession(Ttl)
    );

  createSession = (Ttl: number) =>
    this.extendForOffline(
      () => this.fireAndForget('/client/session', {Ttl}),
      () => mockSessionApi.createSession(Ttl)
    );

  saveSessionDuration = (duration: number) =>
    this.extendForOffline(
      () =>
        this.fireAndForget(`/dictionary/${keys.sessionDuration}`, {
          Data: duration
        }),
      () => mockSessionApi.saveSessionDuration(duration)
    );

  getSessionDuration = () =>
    this.extendForOffline(
      () => this.get(`/dictionary/${keys.sessionDuration}`),
      () => mockSessionApi.getSessionDuration()
    );
}

export default RestSessionApi;
