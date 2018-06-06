import * as React from 'react';
import {Side} from '../../models';
import {
  Figure,
  FigureHint,
  FigureList,
  FigureValue,
  LastPriceValue,
  MidOverlay,
  MidOverlayBackground,
  MidPrice,
  Spread
} from './styles';

export interface FigureListProps {
  isAuth: boolean;
  lastTradePrice: number;
  priceAccuracy: number;
  setMidPriceUpdateHandler: (cb: any) => void;
  getSpreadRelative: () => Promise<number>;
  format: (num: number, accuracy: number, opts?: object) => string;
  handlePriceClickFromOrderBook: (price: number, side: Side) => void;
  isReadOnly: boolean;
  setSpreadHandler: (cb: () => void) => void;
}

interface FigureListState {
  spreadRelative: number;
  mid: number;
}

class Figures extends React.Component<FigureListProps, FigureListState> {
  constructor(props: FigureListProps) {
    super(props);
    this.state = {
      spreadRelative: 0,
      mid: 0
    };
    this.props.setSpreadHandler(this.handleSpreadChange);
    this.props.setMidPriceUpdateHandler(this.handleMidPriceChange);
  }

  handleMidPriceChange = async (mid: () => number) => {
    const midPrice = await mid();
    this.setState({
      mid: midPrice
    });
  };

  handleSpreadChange = async () => {
    const spreadRelative = await this.props.getSpreadRelative();
    if (spreadRelative !== this.state.spreadRelative) {
      this.setState({
        spreadRelative
      });
    }
  };

  render() {
    const {
      isAuth,
      lastTradePrice,
      priceAccuracy,
      format,
      handlePriceClickFromOrderBook,
      isReadOnly
    } = this.props;

    return (
      <FigureList>
        <Figure isAuth={isAuth}>
          <LastPriceValue
            clickable={!isReadOnly}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() =>
              handlePriceClickFromOrderBook(lastTradePrice, Side.Buy)
            }
          >
            {format(lastTradePrice, priceAccuracy)}
          </LastPriceValue>
          <FigureHint>Last price</FigureHint>
        </Figure>
        <MidPrice isAuth={isAuth} clickable={!isReadOnly}>
          <FigureValue
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() =>
              handlePriceClickFromOrderBook(this.state.mid, Side.Buy)
            }
          >
            {format(this.state.mid, priceAccuracy)}
          </FigureValue>
          <FigureHint>Mid price</FigureHint>
        </MidPrice>
        <Spread>
          <FigureValue>
            {format(this.state.spreadRelative, 2, {
              style: 'percent'
            })}
          </FigureValue>
          <FigureHint>Spread</FigureHint>
        </Spread>
        <MidOverlay />
        <MidOverlayBackground />
      </FigureList>
    );
  }
}

export default Figures;
