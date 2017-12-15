import * as React from 'react';
// import {UDFCompatibleDatafeed} from './udf';

// tslint:disable:object-literal-sort-keys
class Chart extends React.Component {
  componentDidMount() {
    // tslint:disable-next-line:no-unused-expression
    new (window as any).TradingView.widget({
      width: 870,
      height: 400,
      symbol: 'NASDAQ:AAPL',
      interval: 'D',
      timezone: 'exchange',
      theme: 'Dark',
      style: 1,
      hide_top_toolbar: true,
      save_image: false,
      hideideas: true,
      container_id: 'tv_chart_container',
      custom_css_url: 'http://localhost:5000/charting_library/static/style.css'
    });
  }

  render() {
    return <div id="tv_chart_container">&nbsp;</div>;
  }
}

export default Chart;
