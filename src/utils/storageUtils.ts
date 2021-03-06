const storage = window.localStorage;

const getItem = (key: string) => () => storage.getItem(key);
const setItem = (key: string) => (value: any) => storage.setItem(key, value);
const removeItem = (key: string) => () => storage.removeItem(key);

const storageWrap = (key: string) => ({
  clear: removeItem(key),
  get: getItem(key),
  set: setItem(key)
});

export default storageWrap;
