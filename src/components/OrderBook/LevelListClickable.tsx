import {curry} from 'rambda';
import React from 'react';
import {Group, Rect} from 'react-konva';
import {LEVELS_COUNT} from '.';
import {Order, Side} from '../../models';

enum Cursor {
  Pointer = 'pointer',
  Default = 'default'
}

const toY = (side: Side, total: number, height: number, idx: number) =>
  (side === Side.Buy ? idx : total - idx - 1) * height;

interface LevelListItemProps {
  order: Order;
  idx: number;
  height: number;
  width: number;
  updateSide: any;
  updateType: any;
  setPriceValue: (value: number) => void;
  setQuantityValue: (value: number) => void;
}

const LevelListItemClickable: React.SFC<LevelListItemProps> = ({
  order,
  idx,
  height,
  width,
  updateSide,
  updateType,
  setPriceValue,
  setQuantityValue
}) => {
  const itemHeight = height / LEVELS_COUNT;
  const y = curry(toY)(order.side, LEVELS_COUNT, itemHeight);

  const handlePriceClick = (event: any) => {
    setPriceValue(order.price);
    updateSide(order.side === Side.Sell);
    updateType(true);
  };

  const handleVolumeClick = (event: any) => {
    setQuantityValue(order.volume);
    updateSide(order.side === Side.Sell);
    updateType(false);
  };

  const handleOnMouseOver = () => {
    document.body.style.cursor = Cursor.Pointer;
  };

  const handleOnMouseLeave = () => {
    document.body.style.cursor = Cursor.Default;
  };

  return (
    <Group x={0} y={y(idx)} width={width} height={itemHeight}>
      <Rect
        x={0}
        y={0}
        width={width / 3}
        height={itemHeight}
        onClick={handlePriceClick}
        onMouseOver={handleOnMouseOver}
        onMouseLeave={handleOnMouseLeave}
      />
      <Rect
        x={width / 3}
        y={0}
        width={width / 3}
        height={itemHeight}
        onClick={handleVolumeClick}
        onMouseOver={handleOnMouseOver}
        onMouseLeave={handleOnMouseLeave}
      />
    </Group>
  );
};

export default LevelListItemClickable;
