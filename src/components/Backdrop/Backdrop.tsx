import * as React from 'react';
import styled from 'styled-components';

const StyledBackdrop = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #232323;
  opacity: 0.7;
  z-index: 30;
`;

const Backdrop: React.SFC = () => {
  return <StyledBackdrop />;
};

export default Backdrop;
