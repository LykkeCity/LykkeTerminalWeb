export const seq = (...fns: any[]) => (...args: any[]) =>
  fns.forEach(f => f(...args));

export const throwPastParam = (param: any, cb: any) => cb(param);
