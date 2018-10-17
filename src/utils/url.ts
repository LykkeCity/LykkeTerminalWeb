const normalizePath = (path: string) =>
  path.startsWith('/') ? path : `/${path}`;

export const pathOrNot = (path?: string) => {
  return path ? normalizePath(path) : '';
};

export const buildUrl = (root: string) => (path?: string) =>
  `${root}${pathOrNot(path)}`;
