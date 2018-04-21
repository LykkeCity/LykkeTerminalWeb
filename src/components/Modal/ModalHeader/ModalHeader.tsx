import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {Icon} from '../../Icon';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledCloseBtn = styled.a`
  color: #f5f6f7;
  text-decoration: none;
  cursor: pointer;
  font-size: ${rem(16)};

  > span {
    position: absolute;
    top: ${rem(5)};
    right: ${rem(25)};
  }
`;

const StyledTitle = styled.div`
  font-family: 'Akrobat';
  font-size: ${rem(20)};
  font-weight: bold;
  line-height: 0.8;
  text-align: left;
`;

const ModalHeader: React.SFC<{
  title?: string;
  onClick: any;
  children?: any;
}> = ({title, onClick, children}) => {
  return (
    <Flex justify={'space-between'}>
      <StyledTitle>{title ? title : children}</StyledTitle>
      <StyledCloseBtn href="#" onClick={onClick}>
        <Icon name="cross" />
      </StyledCloseBtn>
    </Flex>
  );
};

export default ModalHeader;
