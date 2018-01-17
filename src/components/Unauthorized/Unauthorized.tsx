import * as React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import styled from 'styled-components';

const StyledRouterLink = styled(RouterLink)`
  color: #0388ef;
`;

const StyledUnauthorized = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

const Unauthorized: React.SFC<{}> = () => {
  return (
    <StyledUnauthorized>
      Please <StyledRouterLink to="/signin">Sign in</StyledRouterLink> first
    </StyledUnauthorized>
  );
};

export default Unauthorized;
