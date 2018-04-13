import * as React from 'react';

const Figures = () => (
  <React.Fragment>
    <MidFigures>
      <LastTradePrice isAuth={isAuth}>
        <span onClick={this.handleUpdatePrice(Number(lastTradePrice))}>
          {formatNumber(lastTradePrice, priceAccuracy)}
        </span>
      </LastTradePrice>
      <MidPrice isAuth={isAuth}>
        <span onClick={this.handleUpdatePrice(Number(mid))}>
          {formatNumber(mid, priceAccuracy)}
          <br />
          <small>Mid price</small>
        </span>
      </MidPrice>
      <Spread>
        {formatNumber(spreadRelative, priceAccuracy, {
          style: 'percent'
        })}
        <br />
        <small>Spread</small>
      </Spread>
      <MidOverlay />
      <MidOverlayBackground />
    </MidFigures>
  </React.Fragment>
);

export default Figures;
