import styled from '../styled';

export const StyledBackdrop = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: ${({bg}: any) => bg || '#232323'};
  opacity: ${({opacity}: any) => opacity || 0.7};
  z-index: 30;
`;
