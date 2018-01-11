import {Side} from './index';

interface Order {
  id: string;
  volume: number;
  price: number;
  timestamp: any;
  side: Side;
}

export default Order;
