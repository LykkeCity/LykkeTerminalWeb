import * as React from 'react';
import styled from '../styled';

const StyledChart = styled.div`
  height: 100%;
`;

class Chart extends React.Component {
  render() {
    return <StyledChart id="tv_chart_container" />;
  }
}

export default Chart;
