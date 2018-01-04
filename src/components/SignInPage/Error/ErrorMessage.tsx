import * as React from 'react';
import styled from 'styled-components';

const StyledErrors = styled.p`
  color: red;
  clear: both;
`;

interface ErrorProps {
  errorMessage: string;
}

const ErrorMessage: React.SFC<ErrorProps> = ({errorMessage}) => {
  return <StyledErrors>{errorMessage}</StyledErrors>;
};

export default ErrorMessage;
