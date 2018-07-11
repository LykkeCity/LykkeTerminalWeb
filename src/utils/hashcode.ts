export const getHashCode = (target: object) => {
  let hash = 0;
  const stringPresentation = JSON.stringify(target);

  for (let i = 0; i < stringPresentation.length; i++) {
    const char = stringPresentation.charCodeAt(i);
    // tslint:disable-next-line:no-bitwise
    hash = (hash << 5) - hash + char;
    // tslint:disable-next-line:no-bitwise
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash;
};
