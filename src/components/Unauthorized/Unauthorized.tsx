import {inject} from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import {RootStore} from '../../stores/index';
// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledRouterLink = styled.a`
  color: #0388ef;
  cursor: pointer;
  text-decoration: underline;
`;

const StyledUnauthorized = styled(Flex)`
  height: 100%;
`;

const Unauthorized = inject(({authStore: {signIn}}: RootStore) => ({signIn}))(
  ({signIn}) => {
    return (
      <StyledUnauthorized align="center" justify="center">
        <StyledRouterLink onClick={signIn}>Connect</StyledRouterLink>&nbsp;to
        start trading
      </StyledUnauthorized>
    );
  }
);

export default Unauthorized;
