import {curry} from 'rambda';
import React from 'react';
import {Group, Rect} from 'react-konva';
import {LEVELS_COUNT} from '.';
import {InstrumentModel, Order, Side} from '../../models';

const toY = (side: Side, total: number, height: number, idx: number) =>
  (side === Side.Buy ? idx : total - idx - 1) * height;

interface LevelListItemProps {
  order: Order;
  instrument: InstrumentModel;
  format: (num: number, accuracy: number) => string;
  normalize: (num: number) => number;
  idx: number;
  height: number;
  width: number;
}

const LevelListItemClickable: React.SFC<LevelListItemProps> = ({
  order,
  instrument,
  format,
  normalize,
  idx,
  height,
  width
}) => {
  const itemHeight = height / LEVELS_COUNT;
  const y = curry(toY)(order.side, LEVELS_COUNT, itemHeight);

  const handlePriceClick = (event: any) => {
    // tslint:disable-next-line:no-console
    console.log('Price');
  };

  const handleVolumeClick = (event: any) => {
    // tslint:disable-next-line:no-console
    console.log('Volume');
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
