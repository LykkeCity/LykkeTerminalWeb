import * as React from 'react';
import styled from 'styled-components';

const StyledInputNumber = styled.input`
  background-color: transparent;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #f5f6f7;
  padding-left: 5px;
  width: 128px;
  box-sizing: border-box;
  height: 100%;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    cursor: pointer;
    display: block;
    width: 10px;
    background: transparent;
  }
`;

const StyledInputNumberComponent = styled.div`
  position: sticky;

  &::before,
  &::after {
    content: '';
    position: absolute;
    right: 5px;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 6px solid #f5f6f7;
    z-index: -1;
  }

  &::before {
    top: 8px;
  }

  &::after {
    bottom: 8px;
    transform: rotate(180deg);
  }
`;

interface NumberInputProps {
  change: any;
  inputValue: number;
}

const NumberInput: React.SFC<NumberInputProps> = ({change, inputValue}) => {
  return (
    <StyledInputNumberComponent>
      <StyledInputNumber
        type="number"
        min="0"
        onChange={change}
        value={inputValue}
      />
    </StyledInputNumberComponent>
  );
};

export default NumberInput;
