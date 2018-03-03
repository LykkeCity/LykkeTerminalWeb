import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledCloseBtn = styled.a`
  color: #f5f6f7;
  text-decoration: none;
  cursor: pointer;
  font-size: 16px;

  > span {
    position: absolute;
    top: 5px;
    right: 25px;
  }
`;

const StyledTitle = styled.div`
  height: 16px;
  font-family: 'Akrobat';
  font-size: ${rem(20)};
  font-weight: bold;
  line-height: 0.8;
  text-align: left;
`;

const ModalHeader: React.SFC<{title: string; onClick: any}> = ({
  title,
  onClick
}) => {
  return (
    <Flex justify={'space-between'}>
      <StyledTitle>{title}</StyledTitle>
      <StyledCloseBtn href="#" onClick={onClick}>
        <span>&times;</span>
      </StyledCloseBtn>
    </Flex>
  );
};

export default ModalHeader;
