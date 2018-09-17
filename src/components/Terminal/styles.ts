import styled from '../styled';

export const Shell = styled.div`
  color: ${props => props.theme.colors.defaultText};
  background: ${props => props.theme.colors.shellBackground};
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;

  .lykke-header {
    z-index: 20;
  }

  .mosaic.mosaic-blueprint-theme {
    background: ${props => props.theme.colors.mainSplitter} !important;
  }

  .mosaic-tile {
    background: ${props => props.theme.colors.mainBackground};
    margin: 0 1px 1px 0;
  }
`;

export const TerminalWrapper = styled.div`
  position: absolute;
  top: 60px;
  width: 100%;
  height: calc(100% - 60px);
`;
