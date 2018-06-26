import greenlet from 'greenlet';
import {Browser} from '../models';

export const workerMock = (cb: any) => (...args: any[]) =>
  Promise.resolve(cb(...args));

export const getWorkerByCurrentBrowser = (browser: string) => {
  switch (browser) {
    case Browser.Chrome:
    case Browser.Firefox:
      return greenlet;
    default:
      return workerMock;
  }
};
