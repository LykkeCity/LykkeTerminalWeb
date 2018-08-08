import styled from 'styled-components';

export const StyledInput = styled.input`
  background-color: transparent;
  border-radius: 4px;
  border: solid 1px ${props => props.theme.colors.inputBorder};
  color: ${props => props.theme.colors.inputText};
  padding-left: 8px;
  padding-right: 20px;
  height: 32px;
  width: 100%;
  box-sizing: border-box;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    cursor: pointer;
    display: block;
    width: 10px;
    background: transparent;
  }
`;

export const StyledInputNumberComponent = styled.div`
  position: relative;

  > span.up,
  > span.down {
    content: '';
    position: absolute;
    right: 5px;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 6px solid ${props => props.theme.colors.inputText};
    z-index: 5;

    &:hover {
      cursor: pointer;
    }
  }

  > span.up {
    top: 8px;
  }

  > span.down {
    bottom: 8px;
    transform: rotate(180deg);
  }
`;
