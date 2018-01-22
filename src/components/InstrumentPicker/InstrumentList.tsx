import * as React from 'react';
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
        {this.props.instruments.map(x => (
          <InstrumentListItem key={x.id} {...x} onPick={this.props.onPick} />
        ))}
      </StyledInstruments>
    );
  }
}

export default InstrumentList;
