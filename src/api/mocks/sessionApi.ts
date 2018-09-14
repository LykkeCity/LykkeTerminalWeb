import {SessionApi} from '../sessionApi';

export class MockSessionApi implements SessionApi {
  saveSessionNoteShown = (currentDate: any) => Promise.resolve();

  loadSessionNoteShown = () => Promise.resolve({Data: '1000000'});

  getSessionStatus = () =>
    Promise.resolve<any>({
      AffiliateEnabled: false,
      TradingSession: {
        Enabled: false,
        Confirmed: false,
        Ttl: null
      }
    });

  extendSession = (Ttl: number) => Promise.resolve();

  createSession = (Ttl: number) => Promise.resolve();

  saveSessionDuration = (duration: number) => Promise.resolve();

  getSessionDuration = () => Promise.resolve({Data: '1000000'});
}
export default new MockSessionApi();
