import Side from '../../../stores/enums/side';

export default interface WatchlistItemInterface {
  id: string;
  name: string;
  bid: number;
  ask: number;
  side: Side;
};
