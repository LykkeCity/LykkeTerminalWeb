import styled, {colors} from '../styled';

export const Shell = styled.div`
  background: ${colors.darkGraphite};
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;

  .lykke-header {
    z-index: 20;
  }
`;

export const TerminalWrapper = styled.div`
  position: absolute;
  top: 60px;
  width: 100%;
  height: calc(100% - 60px);
`;
