import React from 'react';
import * as ReactDOM from 'react-dom';
import {Layer, Stage} from 'react-konva';
import {InstrumentModel, Order} from '../../models';
import {LevelListItem} from './';
import {FakeOrderBookStage} from './styles';

export interface LevelListProps {
  levels: Order[];
  instrument: InstrumentModel;
  format: (num: number, accuracy: number) => string;
  normalize: (num: number) => number;
  height: number;
  width: number;
  handleOrderBookClick: (x: number, y: number) => void;
  storeLevelCellInfo: (level: void) => any;
}

export class LevelList extends React.Component<LevelListProps> {
  private fakeStage: any;

  handleMouseUp = (e: any) => {
    const {x, y} = e.currentTarget.pointerPos;
    this.props.handleOrderBookClick(x, y);
    this.togglePointerEvents('auto');
  };

  togglePointerEvents = (value: string) =>
    ((ReactDOM.findDOMNode(this.fakeStage) as HTMLDivElement).style[
      'pointer-events'
    ] = value);

  render() {
    const {levels, width, height, ...rest} = this.props;
    return (
      <div>
        <FakeOrderBookStage
          width={width}
          height={height}
          // tslint:disable-next-line:jsx-no-lambda
          onMouseDown={() => this.togglePointerEvents('none')}
          ref={(div: any) => (this.fakeStage = div)}
        />
        <Stage width={width} height={height} onMouseUp={this.handleMouseUp}>
          <Layer hitGraphEnabled={false}>
            {levels.map((o, idx) => (
              <LevelListItem
                key={o.id}
                order={o}
                idx={idx}
                width={width}
                height={height}
                storeLevelCellInfo={this.props.storeLevelCellInfo}
                {...rest}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    );
  }
}
