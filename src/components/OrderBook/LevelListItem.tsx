import {TextConfig} from 'konva';
import {curry} from 'rambda';
import React from 'react';
import {Group, Line, Rect, Text} from 'react-konva';
import {LEVELS_COUNT} from '.';
import {InstrumentModel, Order, OrderBookDisplayType, Side} from '../../models';
import {colors} from '../styled';

const toY = (side: Side, total: number, height: number, idx: number) =>
  (side === Side.Buy ? idx : total - idx - 1) * height;

const fillBySide = (side: Side) =>
  side === Side.Buy ? colors.buy : colors.sell;

const LevelText: React.SFC<TextConfig> = (props: any) => (
  <Text fontFamily="Proxima Nova" fontSize={12.25} {...props} />
);

interface LevelListItemProps {
  order: Order;
  displayType: OrderBookDisplayType;
  instrument: InstrumentModel;
  format: (num: number, accuracy: number) => string;
  normalize: (num: number) => number;
  idx: number;
  height: number;
  width: number;
}

const LevelListItem: React.SFC<LevelListItemProps> = ({
  order,
  displayType,
  instrument,
  format,
  normalize,
  idx,
  height,
  width
}) => {
  const itemHeight = height / LEVELS_COUNT;
  const y = curry(toY)(order.side, LEVELS_COUNT, itemHeight);
  const fill = fillBySide(order.side);
  return (
    <Group x={0} y={y(idx)} width={width} height={itemHeight}>
      <Rect
        x={width / 3}
        y={0.5}
        width={normalize(order[displayType])}
        height={itemHeight - 1}
        fill={fill}
        opacity={0.16}
        cornerRadius={2}
      />
      {order.connectedLimitOrders.length > 0 && (
        <Line
          points={[width / 3 + 1, 2, width / 3 + 1, itemHeight - 2]}
          stroke={fill}
          strokeWidth={2}
          lineCap="round"
        />
      )}
      <Line
        points={[0, 0, width, 0]}
        stroke={colors.graphiteBorder}
        strokeWidth={1}
      />
      <LevelText
        x={8}
        y={10}
        width={width / 3}
        height={height}
        text={format(order.price, instrument.accuracy)}
        fill={fill}
      />
      <LevelText
        x={width / 3 + 8}
        y={10}
        width={width / 3}
        height={height}
        text={format(order[displayType], instrument.baseAsset.accuracy)}
        fill={fill}
      />
      <LevelText
        x={width / 3 * 2}
        y={10}
        width={width / 3}
        height={height}
        text={format(
          order[displayType] * order.price,
          instrument.quoteAsset.accuracy
        )}
        fill={colors.white}
        align="right"
      />
    </Group>
  );
};

export default LevelListItem;
