import * as React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import styled from 'styled-components';
// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledRouterLink = styled(RouterLink)`
  color: #0388ef;
`;

const StyledUnauthorized = styled(Flex)`
  height: 100%;
`;

const Unauthorized = () => {
  return (
    <StyledUnauthorized align="center" justify="center">
      <StyledRouterLink to="/signin">Connect</StyledRouterLink>&nbsp;to start
      trading
    </StyledUnauthorized>
  );
};

export default Unauthorized;
