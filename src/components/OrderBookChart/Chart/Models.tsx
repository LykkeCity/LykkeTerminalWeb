import {Order} from '../../../models';

export interface ChartProps {
  asks: Order[];
  bids: Order[];
  mid: string;
}

export interface OrdersProps {
  orders: Order[];
}
