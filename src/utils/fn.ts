export const seq = (...fns: any[]) => (...args: any[]) =>
  fns.forEach(f => f(...args));
