import React from 'react';
import * as ReactDOM from 'react-dom';
import {Layer, Stage} from 'react-konva';
import {LevelListItem} from './';
import {LevelListProps} from './OrderbookCanvas';
import {FakeOrderBookStage} from './styles';

export class LevelList extends React.Component<LevelListProps> {
  private fakeStage: any;

  handleMouseUp = (e: any) => {
    if (this.props.isReadOnly) {
      return;
    }
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
        {!this.props.isReadOnly && (
          <FakeOrderBookStage
            width={width}
            height={height}
            // tslint:disable-next-line:jsx-no-lambda
            onMouseDown={() => this.togglePointerEvents('none')}
            ref={(div: any) => (this.fakeStage = div)}
          />
        )}
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
