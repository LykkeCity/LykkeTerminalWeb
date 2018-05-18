import {TextConfig} from 'konva';
import {curry} from 'rambda';
import React from 'react';
import {Group, Line, Rect, Text} from 'react-konva';
import {LEFT_PADDING, LEVELS_COUNT, TOP_PADDING} from '.';
import {InstrumentModel, Order, OrderBookDisplayType, Side} from '../../models';
import OrderBookCellType from '../../models/orderBookCellType';
import {colors} from '../styled';

const toY = (side: Side, total: number, height: number, idx: number) =>
  (side === Side.Buy ? idx : total - idx - 1) * height;

const fillBySide = (side: Side) =>
  side === Side.Buy ? colors.buy : colors.sell;

interface TextProps {
  storeLevelCellInfo?: any;
  order?: any;
  type?: string;
}

const LevelText: React.SFC<TextConfig & TextProps> = (props: any) => (
  <Text
    fontFamily="Proxima Nova"
    fontSize={12.25}
    ref={(levelCell: any) =>
      props.storeLevelCellInfo && props.storeLevelCellInfo(levelCell)
    }
    {...props}
  />
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
  storeLevelCellInfo: (levelCell: any) => void;
}

const LevelListItem: React.SFC<LevelListItemProps> = ({
  order,
  displayType,
  instrument,
  format,
  normalize,
  idx,
  height,
  width,
  storeLevelCellInfo
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
        x={LEFT_PADDING}
        y={TOP_PADDING}
        width={width / 3}
        height={itemHeight}
        text={format(order.price, instrument.accuracy)}
        fill={fill}
        storeLevelCellInfo={storeLevelCellInfo}
        order={order}
        type={OrderBookCellType.Price}
      />
      <LevelText
        x={width / 3 + LEFT_PADDING}
        y={TOP_PADDING}
        width={width / 3}
        height={itemHeight}
        text={format(order[displayType], instrument.baseAsset.accuracy)}
        fill={fill}
        storeLevelCellInfo={storeLevelCellInfo}
        order={order}
        type={displayType}
      />
      <LevelText
        x={width / 3 * 2}
        y={TOP_PADDING}
        width={width / 3}
        text={format(
          order[displayType] * order.price,
          instrument.baseAsset.accuracy
        )}
        fill={colors.white}
        align="right"
      />
    </Group>
  );
};

export default LevelListItem;
