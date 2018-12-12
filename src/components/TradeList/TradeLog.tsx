import {isToday} from 'date-fns';
import debounce from 'debounce';
import * as React from 'react';
import {InstrumentModel, Side, TradeModel} from '../../models';
import {
  getDefaultTransitionAnimationState,
  ITransitionAnimationDetail,
  updateTransitionState
} from '../../utils/canvasAnimationUtils';
import {
  defineCanvasScale,
  drawRect,
  drawText,
  fitString
} from '../../utils/canvasUtils';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {LoaderProps} from '../Loader/withLoader';
import {colors} from '../styled';

export interface TradeLogProps extends LoaderProps {
  width: number;
  itemHeight: number;
  selectedInstrument: InstrumentModel;
  trades: TradeModel[];
}

export interface TradeLogState {
  data: TradeModel[];
}

export const TRADE_HEIGHT = 26;
export const LEFT_PADDING = 10;

const TOP_PADDING = 17;
const TRADE_FONT = `12.25px Lekton, monospace`;
const DRAWING_TIMEOUT = 100;
const ANIMATION_INTERVAL = 45;

class TradeLog extends React.Component<TradeLogProps, TradeLogState> {
  canvas: HTMLCanvasElement | null;
  canvasCtx: CanvasRenderingContext2D | null;
  animationStates: ITransitionAnimationDetail[] = [];
  drawingAnimationFrameId: any;
  drawingTimeoutId: any;
  cancelAnimationIntervalId: any;

  constructor(props: TradeLogProps) {
    super(props);

    this.state = {
      data: this.props.trades
    };
  }

  componentWillReceiveProps(args: TradeLogProps) {
    const newTrades = this.getNewTrades(args.trades);

    this.initAnimationStates(newTrades);

    this.setState({data: args.trades}, () => {
      this.refreshTrades(args.trades, newTrades);
    });
  }

  componentDidMount() {
    const {width, itemHeight} = this.props;

    document.addEventListener(
      'visibilitychange',
      () => {
        this.renderTrades(this.props.trades);
      },
      false
    );

    this.canvasCtx = this.canvas!.getContext('2d');

    defineCanvasScale(
      this.canvasCtx,
      this.canvas,
      width,
      itemHeight * this.props.trades.length
    );

    this.renderTrades(this.props.trades);
  }

  componentWillUnmount() {
    if (this.drawingAnimationFrameId) {
      cancelAnimationFrame(this.drawingAnimationFrameId);
    }

    if (this.drawingTimeoutId) {
      clearTimeout(this.drawingTimeoutId);
    }
  }

  renderTrades = (trades: TradeModel[]) => {
    if (!trades.length) {
      return;
    }

    this.renderCanvas(trades);

    clearInterval(this.cancelAnimationIntervalId);
    this.cancelAnimationIntervalId = setInterval(() => {
      if (this.animationStates.length) {
        this.renderCanvas(trades);
      } else {
        clearInterval(this.cancelAnimationIntervalId);
      }
    }, ANIMATION_INTERVAL);
  };

  renderCanvas = (trades: TradeModel[]) => {
    const {width, itemHeight} = this.props;
    defineCanvasScale(
      this.canvasCtx,
      this.canvas,
      width,
      itemHeight * this.props.trades.length
    );

    this.clearCanvas();
    this.drawCanvas(trades);
  };

  clearCanvas = () => {
    if (this.canvas) {
      this.canvasCtx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  };

  drawCanvas = (trades: TradeModel[]) => {
    trades.forEach((trade: TradeModel, index: number) => {
      const priceColor = trade.side === Side.Buy ? colors.buy : colors.sell;

      this.drawAnimation(trade, priceColor, index);
      this.drawPrice(trade.price, priceColor, index);
      this.drawVolume(trade.volume, colors.white, index);
      this.drawTime(trade.timestamp, colors.white, index);
    });
  };

  drawAnimation = (trade: TradeModel, color: string, index: number) => {
    const animationState = this.animationStates.find(
      animationTrade => animationTrade.id === trade.id
    );
    if (animationState) {
      updateTransitionState(animationState);

      if (animationState.isFinished) {
        this.animationStates = this.animationStates.filter(
          animationTrade => animationTrade.id !== trade.id
        );
      } else {
        drawRect({
          ctx: this.canvasCtx!,
          color,
          x: LEFT_PADDING,
          y: TRADE_HEIGHT * index,
          width: this.props.width,
          height: TRADE_HEIGHT,
          opacity: animationState.currentOpacity
        });
      }
    }
  };

  drawPrice = (price: number, color: string, index: number) => {
    drawText({
      ctx: this.canvasCtx!,
      color,
      text: formattedNumber(price, this.props.selectedInstrument.accuracy),
      x: LEFT_PADDING,
      y: TRADE_HEIGHT * index + TOP_PADDING,
      font: TRADE_FONT,
      align: 'start'
    });
  };

  drawVolume = (volume: number, color: string, index: number) => {
    drawText({
      ctx: this.canvasCtx!,
      color,
      text: formattedNumber(
        volume,
        this.props.selectedInstrument.baseAsset.accuracy
      ),
      x: (this.props.width / 3) * 2 - LEFT_PADDING / 2,
      y: TRADE_HEIGHT * index + TOP_PADDING,
      font: TRADE_FONT,
      align: 'end'
    });
  };

  drawTime = (timestamp: string, color: string, index: number) => {
    const date = new Date(timestamp);
    drawText({
      ctx: this.canvasCtx!,
      color,
      text: fitString(
        this.canvasCtx!,
        isToday(date) ? date.toLocaleTimeString() : date.toLocaleString(),
        this.props.width / 3
      ),
      x: this.props.width,
      y: TRADE_HEIGHT * index + TOP_PADDING,
      font: TRADE_FONT,
      align: 'end'
    });
  };

  render() {
    const {width, itemHeight} = this.props;
    const height = itemHeight * this.state.data.length;

    return (
      <canvas
        width={width}
        height={height}
        ref={this.setCanvasRef}
        style={{width, height}}
      />
    );
  }

  private setCanvasRef = (canvas: HTMLCanvasElement) => (this.canvas = canvas);

  private getNewTrades = (trades: TradeModel[]) => {
    const oldTrades = this.state.data;
    return oldTrades.length
      ? trades.filter(trade => {
          return !oldTrades.find(
            (oldTrade: TradeModel) => oldTrade.id === trade.id
          );
        })
      : [];
  };

  private initAnimationStates = (newTrades: TradeModel[]) => {
    this.animationStates = this.animationStates.concat(
      newTrades.map(trade => getDefaultTransitionAnimationState(trade.id))
    );
  };

  private refreshTrades = (
    allTrades: TradeModel[],
    newTrades: TradeModel[]
  ) => {
    if (!newTrades.length) {
      debounce(() => this.renderTrades(allTrades), DRAWING_TIMEOUT)();
    } else if (!this.drawingAnimationFrameId) {
      this.runDrawingMechanism();
    }
  };

  private runDrawingMechanism = () => {
    // Render canvas within some interval to prevent high processor load during large amount of trades came from wamp
    cancelAnimationFrame(this.drawingAnimationFrameId);
    this.drawingAnimationFrameId = null;
    this.drawingAnimationFrameId = window.requestAnimationFrame(() => {
      this.renderTrades(this.state.data);
    });

    // Stop canvas redraw after some time to reduce processor load
    clearTimeout(this.drawingTimeoutId);
    this.drawingTimeoutId = setTimeout(() => {
      cancelAnimationFrame(this.drawingAnimationFrameId);
      this.drawingAnimationFrameId = null;
    }, DRAWING_TIMEOUT);
  };
}

export default TradeLog;
