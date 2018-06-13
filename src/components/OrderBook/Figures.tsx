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
  format: (num: number, accuracy: number, opts?: object) => string;
  handlePriceClickFromOrderBook: (price: number, side: Side) => void;
  isReadOnly: boolean;
  spreadRelative: number;
  mid: number;
}

class Figures extends React.Component<FigureListProps> {
  constructor(props: FigureListProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: any) {
    const {
      spreadRelative: oldSpread,
      mid: oldMid,
      lastTradePrice: oldLastPrice
    } = this.props;
    const {
      spreadRelative: nextSpread,
      mid: nextMid,
      lastTradePrice: nextLastPrice
    } = nextProps;
    return (
      oldSpread !== nextSpread ||
      oldMid !== nextMid ||
      oldLastPrice !== nextLastPrice
    );
  }

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
              handlePriceClickFromOrderBook(this.props.mid, Side.Buy)
            }
          >
            {format(this.props.mid, priceAccuracy)}
          </FigureValue>
          <FigureHint>Mid price</FigureHint>
        </MidPrice>
        <Spread>
          <FigureValue>
            {format(this.props.spreadRelative, 2, {
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
