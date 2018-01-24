import * as React from 'react';
import styled from 'styled-components';

const StyledBackdrop = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
  position: absolute;
  z-index: 2;
`;

const Backdrop: React.SFC = () => {
  return <StyledBackdrop />;
};

export default Backdrop;
