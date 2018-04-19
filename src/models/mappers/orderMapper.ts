export const toOrder = (dto: any) => ({
  id: dto.Id,
  price: dto.Price,
  timestamp: dto.DateTime,
  volume: dto.Volume,
  depth: 0,
  orderVolume: 0,
  connectedLimitOrders: []
});
