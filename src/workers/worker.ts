export const workerMock = (cb: any) => (...args: any[]) =>
  Promise.resolve(cb(...args));
