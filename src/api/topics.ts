export const orderBook = (asset: string, side: string) =>
  `orderbook.${asset.toLowerCase()}.${side.toLowerCase()}`;
