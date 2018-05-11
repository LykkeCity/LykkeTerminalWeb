import * as React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  background-color: transparent;
  border-radius: 4px;
  border: solid 1px #56595e;
  color: #f5f6f7;
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

const StyledInputNumberComponent = styled.div`
  position: relative;

  > span.up,
  > span.down {
    content: '';
    position: absolute;
    right: 5px;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 6px solid #f5f6f7;
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

interface NumberInput {
  id?: string;
  value?: string;
  onChange: any;
  onArrowClick: any;
}

const NumberInput: React.SFC<NumberInput> = ({
  id,
  value,
  onChange,
  onArrowClick
}) => {
  return (
    <StyledInputNumberComponent>
      <StyledInput
        id={id}
        type="text"
        value={value}
        onChange={onChange()}
        // tslint:disable-next-line:jsx-no-lambda
        onKeyDown={e => {
          switch (e.keyCode) {
            case 38:
              onArrowClick('up')();
              e.preventDefault();
              break;
            case 40:
              onArrowClick('down')();
              e.preventDefault();
              break;
            default:
              break;
          }
        }}
        name={value}
      />
      <span className="up" onClick={onArrowClick('up')} />
      <span className="down" onClick={onArrowClick('down')} />
    </StyledInputNumberComponent>
  );
};

export default NumberInput;
