export const seq = (...fns: any[]) => (...args: any[]) =>
  fns.forEach(f => f(...args));

export const switchcase = (cases: any) => (key: string) => cases[key];
