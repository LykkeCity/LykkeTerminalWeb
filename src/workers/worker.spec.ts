import greenlet from 'greenlet';
import {Browser} from '../models';
import {getWorkerByCurrentBrowser, workerMock} from './worker';

describe('worker', () => {
  const summarised = (a: number, b: number) => a + b;
  const first = 1;
  const second = 2;

  it('mock should wrapped a function with promise ', async () => {
    const summarisedInWorker = workerMock(summarised);
    const result = await summarisedInWorker(first, second);

    expect(result).toBe(summarised(first, second));
  });

  it('getWorkerByCurrentBrowser should return greenlet', () => {
    expect(getWorkerByCurrentBrowser(Browser.Firefox)).toBe(greenlet);
    expect(getWorkerByCurrentBrowser(Browser.Chrome)).toBe(greenlet);
  });

  it('should return mock for not Chrome and Firefox browsers', async () => {
    const summarisedInWorker = getWorkerByCurrentBrowser(Browser.Edge)(
      summarised
    );

    const result = await summarisedInWorker(first, second);
    expect(result).toBe(summarised(first, second));
  });
});
