import styled, {colors} from '../styled';

export const Background = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: ${colors.lightGraphite};
`;

export const StyledBackdrop = styled(Background)`
  position: absolute;
  background: #232323;
  opacity: 0.7;
  z-index: 30;
`;
