import * as React from 'react';
import styled from 'styled-components';
import ErrorMessage from '../Error/ErrorMessage';

const StyledLabel = styled.label`
  float: left;
  width: 100px;
  text-transform: capitalize;
`;

const StyledInput = styled.input`
  float: right;
`;

const StyledInputBlock = styled.div`
  margin-top: 10px;
  width: 100%;
`;

interface InputFieldProps {
  id: string;
  inputValue: string;
  change: any;
  errorMessage: string;
}

const InputField: React.SFC<InputFieldProps> = ({
  id,
  inputValue,
  change,
  errorMessage
}) => {
  return (
    <StyledInputBlock>
      <StyledLabel htmlFor={id}>{id}</StyledLabel>
      <StyledInput id={id} type={id} value={inputValue} onChange={change} />
      <ErrorMessage errorMessage={errorMessage} />
    </StyledInputBlock>
  );
};

export default InputField;
