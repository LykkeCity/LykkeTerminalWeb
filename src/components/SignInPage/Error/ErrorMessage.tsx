import * as React from 'react';
import styled from 'styled-components';
import {ErrorProps} from '../index';

const StyledErrors = styled.p`
  color: red;
  clear: both;
`;

const ErrorMessage: React.SFC<ErrorProps> = ({errorMessage}) => {
  return <StyledErrors>{errorMessage}</StyledErrors>;
};

export default ErrorMessage;
