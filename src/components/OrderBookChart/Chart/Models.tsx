import {AssetModel, Order} from '../../../models';

export interface ChartProps {
  asks: Order[];
  bids: Order[];
  mid: string;
  baseAsset: AssetModel;
  quoteAsset: AssetModel;
}

export interface PointerProps {
  orders: Order[];
  side: string;
  points: number[];
  borders: number[];
  color: string;
  baseAsset: AssetModel;
  quoteAsset: AssetModel;
}
