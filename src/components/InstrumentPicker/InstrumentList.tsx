import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import styled from 'styled-components';
import {InstrumentListItem, InstrumentListProps} from './index';

const StyledInstruments = styled.div`
  overflow: auto;
  max-height: 560px;
`;

class InstrumentList extends React.Component<InstrumentListProps> {
  componentDidMount() {
    this.props.change();
  }

  render() {
    return (
      <StyledInstruments>
        <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={540}>
          {this.props.instruments.map(x => (
            <InstrumentListItem
              key={x.id}
              instrument={x}
              onPick={this.props.onPick}
              inactive={this.props.currentInstrumentId !== x.id}
            />
          ))}
        </Scrollbars>
      </StyledInstruments>
    );
  }
}

export default InstrumentList;
