import {curry} from 'rambda';
import React from 'react';
import {Group, Rect} from 'react-konva';
import {LEVELS_COUNT} from '.';
import {Order, Side} from '../../models';

const toY = (side: Side, total: number, height: number, idx: number) =>
  (side === Side.Buy ? idx : total - idx - 1) * height;

interface LevelListItemProps {
  order: Order;
  idx: number;
  height: number;
  width: number;
  updatePrice: any;
  updateDepth: any;
  updateOrderState: any;
}

const LevelListItemClickable: React.SFC<LevelListItemProps> = ({
  order,
  idx,
  height,
  width,
  updatePrice,
  updateDepth,
  updateOrderState
}) => {
  const itemHeight = height / LEVELS_COUNT;
  const y = curry(toY)(order.side, LEVELS_COUNT, itemHeight);

  const handlePriceClick = (event: any) => {
    updatePrice(order.price);
    updateOrderState({
      isLimitActive: true,
      isMarketActive: false,
      isSellActive: order.side === Side.Sell
    });
  };

  const handleVolumeClick = (event: any) => {
    updateDepth(order.volume);
    updateOrderState({
      isLimitActive: false,
      isMarketActive: true,
      isSellActive: order.side === Side.Sell
    });
  };

  return (
    <Group x={0} y={y(idx)} width={width} height={itemHeight}>
      <Rect
        x={0}
        y={0}
        width={width / 3}
        height={itemHeight}
        onClick={handlePriceClick}
      />
      <Rect
        x={width / 3}
        y={0}
        width={width / 3}
        height={itemHeight}
        onClick={handleVolumeClick}
      />
    </Group>
  );
};

export default LevelListItemClickable;
