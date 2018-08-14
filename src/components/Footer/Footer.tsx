import * as React from 'react';
import {ConnectionStatus} from '../ConnectionStatus';
import {FooterItem, FooterWrapper} from './styles';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const Footer: React.SFC = () => {
  return (
    <FooterWrapper>
      <Flex justify="stretch" align="center">
        <FooterItem>
          <Flex>
            <ConnectionStatus />
          </Flex>
        </FooterItem>
      </Flex>
    </FooterWrapper>
  );
};

export default Footer;
