import * as React from 'react';
import styled from 'styled-components';
import {Chart} from '../Chart/index';
import DepthChart from '../DepthChart';

const ChartContainer = styled.div`
  height: 65%;
`;

const DepthChartContainer = styled.div`
  height: 35%;
`;

class ChartTabbedTile extends React.Component<any> {
  render() {
    return (
      <React.Fragment>
        <ChartContainer>
          <Chart />
        </ChartContainer>
        <DepthChartContainer>
          <DepthChart />
        </DepthChartContainer>
      </React.Fragment>
    );
  }
}

export default ChartTabbedTile;
