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
  mid: number;
  spreadRelative: number;
  format: (num: number, accuracy: number, opts?: object) => string;
  handlePriceClickFromOrderBook: (price: number, side: Side) => void;
}

export default ({
  isAuth,
  lastTradePrice,
  priceAccuracy,
  mid,
  spreadRelative,
  format,
  handlePriceClickFromOrderBook
}: FigureListProps) => (
  <FigureList>
    <Figure isAuth={isAuth}>
      <LastPriceValue
        // tslint:disable-next-line:jsx-no-lambda
        onClick={() => handlePriceClickFromOrderBook(lastTradePrice, Side.Buy)}
      >
        {format(lastTradePrice, priceAccuracy)}
      </LastPriceValue>
      <FigureHint>Last price</FigureHint>
    </Figure>
    <MidPrice isAuth={isAuth}>
      <FigureValue
        // tslint:disable-next-line:jsx-no-lambda
        onClick={() => handlePriceClickFromOrderBook(mid, Side.Buy)}
      >
        {format(mid, priceAccuracy)}
      </FigureValue>
      <FigureHint>Mid price</FigureHint>
    </MidPrice>
    <Spread>
      <FigureValue>
        {format(spreadRelative, 2, {
          style: 'percent'
        })}
      </FigureValue>
      <FigureHint>Spread</FigureHint>
    </Spread>
    <MidOverlay />
    <MidOverlayBackground />
  </FigureList>
);
