import React from 'react';
import {Layer, Stage} from 'react-konva';
import {InstrumentModel, Order} from '../../models';
import {LevelListItem} from './';

export interface LevelListProps {
  levels: Order[];
  instrument: InstrumentModel;
  format: (num: number, accuracy: number) => string;
  normalize: (num: number) => number;
  height: number;
  width: number;
}

export class LevelList extends React.Component<LevelListProps> {
  render() {
    const {levels, width, height, ...rest} = this.props;
    return (
      <Stage width={width} height={height}>
        <Layer hitGraphEnabled={false}>
          {levels.map((o, idx) => (
            <LevelListItem
              key={o.id}
              order={o}
              idx={idx}
              width={width}
              height={height}
              {...rest}
            />
          ))}
        </Layer>
      </Stage>
    );
  }
}
