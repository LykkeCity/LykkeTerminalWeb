import * as React from 'react';
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
}

export default ({
  isAuth,
  lastTradePrice,
  priceAccuracy,
  mid,
  spreadRelative,
  format
}: FigureListProps) => (
  <FigureList>
    <Figure isAuth={isAuth}>
      <LastPriceValue>{format(lastTradePrice, priceAccuracy)}</LastPriceValue>
      <FigureHint>Last price</FigureHint>
    </Figure>
    <MidPrice isAuth={isAuth}>
      <FigureValue>{format(mid, priceAccuracy)}</FigureValue>
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
